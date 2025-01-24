"use client";

import Image from "next/image";
import type { ContentElement } from "@/types/swipe-data";

type ImageElementProps = {
  element: ContentElement & { uri: string };
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
