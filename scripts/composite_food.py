"""
composite_food.py — Realistic food compositing for restaurant photography.

Accepts ANY food photo — JPEG, PNG with or without alpha. If the foreground
has no transparency, the background is removed automatically using an AI model
(rembg / U2Net) before compositing begins. No manual cutouts needed.

Four physical rules make the result look like a real photograph:

  1. Placement  — scales food down and anchors it to the table surface
  2. Shadow     — generates a soft contact shadow from the container shape
  3. Light Match — tints food highlights to match the room's ambient neon colour
  4. Focus      — blurs the background with a depth-of-field gradient

Usage:
    python scripts/composite_food.py \
        --background public/images/miners-arms/IMG_4161.jpg \
        --foreground food_photo.jpg \
        --output result.jpg

Optional tuning flags:
    --scale          0.40   food width as fraction of background width
    --vertical-pos   0.78   where the bottom of the food sits (0=top, 1=bottom)
    --shadow-opacity 0.50   shadow darkness  (0.0 – 1.0)
    --blur-sigma     5      background blur radius in pixels
    --tint-strength  0.22   how strongly the neon colour tints food highlights
    --max-width      1920   cap background resolution before compositing
    --model          u2net  rembg model: u2net | u2net_human_seg | isnet-general-use
"""

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


# ---------------------------------------------------------------------------
# Background removal (auto-cutout)
# ---------------------------------------------------------------------------

def ensure_cutout(img: Image.Image, model_name: str) -> Image.Image:
    """
    Returns an RGBA image with the background removed.
    If the image already has a non-trivial alpha channel, it is returned as-is.
    Otherwise, rembg is used to create the cutout automatically.
    """
    if img.mode == "RGBA":
        alpha = np.array(img.split()[-1])
        # If more than 5% of pixels are transparent, treat it as a pre-cut image
        transparent_ratio = (alpha < 10).sum() / alpha.size
        if transparent_ratio > 0.05:
            print("Foreground already has alpha channel — skipping background removal")
            return img

    print(f"Removing background automatically (model: {model_name}) …")
    print("  First run downloads the model (~170 MB) and may take a minute.")

    try:
        from rembg import remove, new_session
    except ImportError:
        print(
            'Error: rembg is not installed. Run: pip install "rembg[cpu]"',
            file=sys.stderr,
        )
        sys.exit(1)

    session = new_session(model_name)
    cutout = remove(img.convert("RGBA"), session=session)
    print("Background removed.")
    return cutout


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def pil_to_cv2(img: Image.Image) -> np.ndarray:
    """PIL RGBA/RGB → BGR/BGRA numpy array for OpenCV."""
    arr = np.array(img)
    if arr.ndim == 3 and arr.shape[2] == 4:
        return cv2.cvtColor(arr, cv2.COLOR_RGBA2BGRA)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)


def alpha_composite_onto(base: np.ndarray, overlay: np.ndarray, x: int, y: int) -> np.ndarray:
    """
    Alpha-composite an RGBA overlay onto an RGB base canvas at position (x, y).
    Returns a new RGB uint8 array. Handles out-of-bounds crops automatically.
    """
    bh, bw = base.shape[:2]
    oh, ow = overlay.shape[:2]

    x0, y0 = max(x, 0), max(y, 0)
    x1, y1 = min(x + ow, bw), min(y + oh, bh)
    if x1 <= x0 or y1 <= y0:
        return base.copy()

    ox0, oy0 = x0 - x, y0 - y
    ox1, oy1 = ox0 + (x1 - x0), oy0 + (y1 - y0)

    region = base[y0:y1, x0:x1].astype(np.float32)
    patch = overlay[oy0:oy1, ox0:ox1]

    rgb = patch[..., :3].astype(np.float32)
    alpha = patch[..., 3:4].astype(np.float32) / 255.0

    blended = region * (1.0 - alpha) + rgb * alpha
    result = base.copy()
    result[y0:y1, x0:x1] = np.clip(blended, 0, 255).astype(np.uint8)
    return result


# ---------------------------------------------------------------------------
# Rule 1 — Placement
# ---------------------------------------------------------------------------

def scale_and_position_food(
    fg: Image.Image,
    bg_w: int,
    bg_h: int,
    scale: float,
    vertical_pos: float,
) -> tuple[Image.Image, int, int]:
    """
    Returns (scaled_food, paste_x, paste_y).
    Bottom edge of food lands at bg_h * vertical_pos, centred horizontally.
    """
    target_w = int(bg_w * scale)
    ratio = target_w / fg.width
    target_h = int(fg.height * ratio)
    scaled = fg.resize((target_w, target_h), Image.LANCZOS)

    paste_x = (bg_w - target_w) // 2
    paste_y = int(bg_h * vertical_pos) - target_h

    return scaled, paste_x, paste_y


# ---------------------------------------------------------------------------
# Rule 2 — Shadow
# ---------------------------------------------------------------------------

def build_shadow(food: Image.Image, shadow_opacity: float) -> tuple[np.ndarray, int, int]:
    """
    Builds a soft contact shadow from the food alpha channel.

    Returns (shadow_rgba, offset_x, offset_y) — offsets relative to the food's
    paste position so the shadow sits underneath the container.
    """
    food_arr = np.array(food)
    alpha = food_arr[..., 3]

    fw, fh = food.size

    # Flatten onto table plane: compress vertically to ~35%, widen slightly
    shadow_h = max(int(fh * 0.35), 10)
    shadow_w = int(fw * 1.15)

    silhouette = cv2.resize(alpha, (shadow_w, shadow_h), interpolation=cv2.INTER_AREA)

    # Heavy blur for soft shadow edge
    blur_radius = max(int(fh * 0.07), 12)
    k = blur_radius * 2 + 1
    blurred = cv2.GaussianBlur(silhouette.astype(np.float32), (k, k), blur_radius)
    blurred = (blurred / 255.0) * shadow_opacity * 255.0

    shadow_rgba = np.zeros((shadow_h, shadow_w, 4), dtype=np.uint8)
    shadow_rgba[..., 3] = np.clip(blurred, 0, 255).astype(np.uint8)

    # Centre the wider shadow under food; drift right for light direction
    offset_x = int(fw * 0.02) - (shadow_w - fw) // 2
    offset_y = fh - shadow_h + int(fh * 0.04)

    return shadow_rgba, offset_x, offset_y


# ---------------------------------------------------------------------------
# Rule 3 — Light Matching
# ---------------------------------------------------------------------------

def sample_ambient_color(bg_bgr: np.ndarray) -> np.ndarray | None:
    """
    Returns the dominant warm/neon RGB colour from the background,
    or None if no vivid neon pixels are found.
    """
    hsv = cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    # OpenCV hue is 0–180 (half of 360°)
    # Pink/magenta ≈ 150–180° | 0–12°;  warm amber ≈ 10–25°
    mask_pink = ((h >= 150) | (h <= 12)) & (s > 80) & (v > 120)
    mask_warm = (h >= 10) & (h <= 25) & (s > 80) & (v > 120)
    mask = mask_pink | mask_warm

    if mask.sum() < 100:
        return None

    bg_rgb = cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    ambient = np.average(bg_rgb[mask], axis=0, weights=v[mask])
    return np.clip(ambient, 0, 255).astype(np.float32)


def soft_light_blend(base: np.ndarray, tint: np.ndarray) -> np.ndarray:
    dark = 2.0 * base * tint
    light = 1.0 - 2.0 * (1.0 - base) * (1.0 - tint)
    return np.where(tint < 0.5, dark, light)


def apply_light_tint(food: Image.Image, ambient_rgb: np.ndarray, strength: float) -> Image.Image:
    """Tints highlight areas of the food with the room's ambient neon colour."""
    food_arr = np.array(food)
    rgb = food_arr[..., :3].astype(np.uint8)
    alpha = food_arr[..., 3]

    lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)
    L = lab[..., 0]
    highlight_mask = (L > 155).astype(np.float32)[..., np.newaxis]

    base_f = rgb.astype(np.float32) / 255.0
    tint_f = (ambient_rgb / 255.0).reshape(1, 1, 3)

    blended = soft_light_blend(base_f, tint_f)
    tinted = base_f * (1.0 - strength * highlight_mask) + blended * (strength * highlight_mask)

    result = np.clip(tinted * 255, 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([result, alpha]), "RGBA")


# ---------------------------------------------------------------------------
# Rule 4 — Focus (Depth of Field)
# ---------------------------------------------------------------------------

def apply_depth_of_field(bg_bgr: np.ndarray, blur_sigma: float, focal_y: int) -> np.ndarray:
    """
    Gradient blur: sharpest at focal_y (table surface), increasingly blurred
    toward the top of the image. Slight secondary blur below for realism.
    """
    h, w = bg_bgr.shape[:2]

    k = int(blur_sigma * 3) * 2 + 1
    blurred = cv2.GaussianBlur(bg_bgr, (k, k), blur_sigma)

    ys = np.arange(h, dtype=np.float32)
    blend_top = np.clip((focal_y - ys) / (focal_y - h * 0.30 + 1e-6), 0, 1)
    blend_bottom = np.clip((ys - focal_y) / (h * 0.25 + 1e-6), 0, 0.30)
    blend = np.maximum(blend_top, blend_bottom)[:, np.newaxis, np.newaxis]  # (h,1,1)

    out = bg_bgr.astype(np.float32) * (1.0 - blend) + blurred.astype(np.float32) * blend
    return np.clip(out, 0, 255).astype(np.uint8)


# ---------------------------------------------------------------------------
# Main compositing pipeline
# ---------------------------------------------------------------------------

def composite(
    background_path: str,
    foreground_path: str,
    output_path: str,
    scale: float,
    vertical_pos: float,
    shadow_opacity: float,
    blur_sigma: float,
    tint_strength: float,
    max_width: int,
    model_name: str,
) -> None:
    # --- Load ---
    bg_pil = Image.open(background_path).convert("RGB")
    fg_raw = Image.open(foreground_path)

    # --- Auto background removal if needed ---
    fg_pil = ensure_cutout(fg_raw, model_name)

    # --- Cap background resolution ---
    if bg_pil.width > max_width:
        ratio = max_width / bg_pil.width
        bg_pil = bg_pil.resize((max_width, int(bg_pil.height * ratio)), Image.LANCZOS)
        print(f"Background downscaled to {bg_pil.width}×{bg_pil.height}")

    bg_bgr = pil_to_cv2(bg_pil)
    bg_h, bg_w = bg_bgr.shape[:2]
    print(f"Background: {bg_w}×{bg_h}  |  Foreground: {fg_pil.width}×{fg_pil.height}")

    # --- Rule 1: Placement ---
    food_scaled, food_x, food_y = scale_and_position_food(fg_pil, bg_w, bg_h, scale, vertical_pos)
    table_y = food_y + food_scaled.height
    print(f"Food placed at ({food_x}, {food_y}), size {food_scaled.width}×{food_scaled.height}")

    # --- Rule 4: DOF blur ---
    bg_dof = apply_depth_of_field(bg_bgr, blur_sigma, table_y)
    print(f"DOF blur applied (sigma={blur_sigma}, focal row={table_y})")

    # --- Rule 3: Light tint ---
    ambient = sample_ambient_color(bg_bgr)
    if ambient is not None and tint_strength > 0:
        food_final = apply_light_tint(food_scaled, ambient, tint_strength)
        print(f"Light tint applied — ambient RGB: {ambient.astype(int)}")
    else:
        food_final = food_scaled
        if ambient is None:
            print("Light tint skipped — no vivid neon pixels detected")

    # --- Composite: shadow then food ---
    canvas = cv2.cvtColor(bg_dof, cv2.COLOR_BGR2RGB)

    # Rule 2: Shadow
    shadow_rgba, sh_off_x, sh_off_y = build_shadow(food_final, shadow_opacity)
    canvas = alpha_composite_onto(canvas, shadow_rgba, food_x + sh_off_x, food_y + sh_off_y)
    print(f"Shadow composited (size {shadow_rgba.shape[1]}×{shadow_rgba.shape[0]})")

    # Sharp food on top
    canvas = alpha_composite_onto(canvas, np.array(food_final), food_x, food_y)
    print("Food composited (sharp)")

    # --- Save ---
    out_path = Path(output_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out = Image.fromarray(canvas)
    kwargs: dict = {}
    if out_path.suffix.lower() in (".jpg", ".jpeg"):
        kwargs = {"quality": 95, "subsampling": 0}
    out.save(output_path, **kwargs)
    print(f"\nSaved → {output_path}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Composite a food photo onto a restaurant background. "
            "Background removal is automatic — no pre-cut images needed."
        )
    )
    parser.add_argument("--background", required=True, help="Restaurant background image (JPEG/PNG)")
    parser.add_argument("--foreground", required=True, help="Food photo — any JPEG or PNG, with or without alpha")
    parser.add_argument("--output", required=True, help="Output file path")
    parser.add_argument("--scale", type=float, default=0.40, help="Food width as fraction of background width (default: 0.40)")
    parser.add_argument("--vertical-pos", type=float, default=0.78, dest="vertical_pos", help="Table surface row, 0=top 1=bottom (default: 0.78)")
    parser.add_argument("--shadow-opacity", type=float, default=0.50, dest="shadow_opacity", help="Shadow darkness 0–1 (default: 0.50)")
    parser.add_argument("--blur-sigma", type=float, default=5.0, dest="blur_sigma", help="Background blur radius px (default: 5)")
    parser.add_argument("--tint-strength", type=float, default=0.22, dest="tint_strength", help="Neon tint on highlights 0–1 (default: 0.22)")
    parser.add_argument("--max-width", type=int, default=1920, dest="max_width", help="Cap background width before compositing (default: 1920)")
    parser.add_argument("--model", default="u2net", dest="model_name", help="rembg model for background removal (default: u2net)")

    args = parser.parse_args()

    for path, label in [(args.background, "--background"), (args.foreground, "--foreground")]:
        if not Path(path).exists():
            print(f"Error: {label} file not found: {path}", file=sys.stderr)
            sys.exit(1)

    composite(
        background_path=args.background,
        foreground_path=args.foreground,
        output_path=args.output,
        scale=args.scale,
        vertical_pos=args.vertical_pos,
        shadow_opacity=args.shadow_opacity,
        blur_sigma=args.blur_sigma,
        tint_strength=args.tint_strength,
        max_width=args.max_width,
        model_name=args.model_name,
    )


if __name__ == "__main__":
    main()
