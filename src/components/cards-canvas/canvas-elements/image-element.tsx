"use client";

import Image from "next/image";
import type { ImageElement } from "@/types/swipe-data";

type ImageElementProps = {
  element: ImageElement;
};

export function ImageElement({ element }: ImageElementProps) {
  return (
    <div
      className={`relative ${element.width === "fill" ? "w-full" : "w-auto"}`}
    >
      <Image
        fill
        src={element.uri || "/placeholder.svg"}
        alt="Slide content"
        className="object-contain"
      />
    </div>
  );
}
