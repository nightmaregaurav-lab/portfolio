"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ResponsiveImageProps = Omit<ImageProps, "width" | "height" | "fill">;

export default function ResponsiveImage({
  src,
  alt,
  style,
  ...props
}: ResponsiveImageProps) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  return (
    <Image
      src={src}
      alt={alt}
      width={dimensions?.width || 1000}
      height={dimensions?.height || 1000}
      onLoad={(e) => {
        const img = e.currentTarget;

        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      }}
      style={{
        width: "100%",
        height: "auto",
        ...style,
      }}
      {...props}
    />
  );
}
