"""
composite_server.py — Local Flask API for the Miners Arms n8n compositing pipeline.

Replaces the Gemini image-edit node in MINERS-Social-Responder.json.

POST /composite
  - multipart/form-data: food_image (binary)
  - optional form field: background_url (string) — if omitted, picks a random
    image from the Miners Arms gallery API
  Returns: JPEG binary (the composited image)

Start with:
    python scripts/composite_server.py

Then the n8n HTTP Request node calls http://localhost:5050/composite
"""

import io
import os
import random
import sys
import tempfile
from pathlib import Path

import requests
from flask import Flask, request, send_file, jsonify
from PIL import Image

# Add scripts/ to path so we can import from composite_food
sys.path.insert(0, str(Path(__file__).parent))
from composite_food import composite

GALLERY_API = "https://www.miners-arms.com/api/gallery/public"
PORT = int(os.environ.get("COMPOSITE_PORT", 5050))

app = Flask(__name__)


def fetch_random_background() -> Image.Image:
    resp = requests.get(GALLERY_API, timeout=10)
    resp.raise_for_status()
    images = [i for i in resp.json() if isinstance(i.get("src"), str) and i["src"].startswith("http")]
    if not images:
        raise RuntimeError("Gallery API returned no images")
    picked = random.choice(images)
    img_resp = requests.get(picked["src"], timeout=15)
    img_resp.raise_for_status()
    return Image.open(io.BytesIO(img_resp.content)).convert("RGB")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/composite", methods=["POST"])
def composite_endpoint():
    if "food_image" not in request.files:
        return jsonify({"error": "food_image file is required"}), 400

    food_bytes = request.files["food_image"].read()

    # Background: caller can supply a URL, otherwise pick from gallery
    background_url = request.form.get("background_url")
    try:
        if background_url:
            img_resp = requests.get(background_url, timeout=15)
            img_resp.raise_for_status()
            bg = Image.open(io.BytesIO(img_resp.content)).convert("RGB")
        else:
            bg = fetch_random_background()
    except Exception as e:
        return jsonify({"error": f"Could not load background: {e}"}), 500

    # Write temp files so composite() can read them (it uses Pillow internally)
    with tempfile.TemporaryDirectory() as tmpdir:
        food_path = os.path.join(tmpdir, "food.jpg")
        bg_path = os.path.join(tmpdir, "bg.jpg")
        out_path = os.path.join(tmpdir, "result.jpg")

        Image.open(io.BytesIO(food_bytes)).save(food_path)
        bg.save(bg_path)

        try:
            composite(
                background_path=bg_path,
                foreground_path=food_path,
                output_path=out_path,
                scale=float(request.form.get("scale", 0.40)),
                vertical_pos=float(request.form.get("vertical_pos", 0.78)),
                shadow_opacity=float(request.form.get("shadow_opacity", 0.50)),
                blur_sigma=float(request.form.get("blur_sigma", 5.0)),
                tint_strength=float(request.form.get("tint_strength", 0.22)),
                max_width=int(request.form.get("max_width", 1920)),
                model_name=request.form.get("model", "u2net"),
            )
        except Exception as e:
            return jsonify({"error": f"Compositing failed: {e}"}), 500

        return send_file(
            out_path,
            mimetype="image/jpeg",
            as_attachment=False,
            download_name="composite.jpg",
        )


if __name__ == "__main__":
    print(f"Composite server starting on http://localhost:{PORT}")
    print(f"  POST http://localhost:{PORT}/composite  (field: food_image)")
    print(f"  GET  http://localhost:{PORT}/health")
    app.run(host="0.0.0.0", port=PORT, debug=False)
