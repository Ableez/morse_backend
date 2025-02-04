"use client";

import Image from "next/image";
import type { CarouselElement } from "#/types/swipe-data";

type CarouselElementProps = {
  element: CarouselElement;
};

export function CarouselElement({ element }: CarouselElementProps) {
  return (
    <div className="flex gap-4 overflow-x-auto p-2">
      {element.images?.map((image, i) => (
        <div key={i} className="relative h-32 w-48 flex-shrink-0">
          <Image
            src={image || "/placeholder.svg"}
            alt={`Carousel item ${i + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
