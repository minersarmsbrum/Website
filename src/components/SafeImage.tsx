"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image wrapper that fades in on load and, if the remote image fails,
 * leaves the parent's gradient backdrop showing instead of a broken icon.
 * Always render inside a container with its own dark gradient background.
 */
export function SafeImage({
  className = "",
  alt,
  ...props
}: ImageProps & { alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <Image
      {...props}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`${className} transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
