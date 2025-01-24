"use client";

import { TextElement } from "./canvas-elements/text-element";
import { CarouselElement } from "./canvas-elements/carousel-element";
import type { ContentElement } from "@/types/swipe-data";
import { ImageElement } from "./canvas-elements/image-element";
import { OptionsElement } from "./canvas-elements/option-element";

type ElementRendererProps = {
  element: ContentElement;
};

export function ElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    case "text":
      return <TextElement element={element} />;
    case "image":
      return <ImageElement element={element} />;
    case "carousel":
      return <CarouselElement element={element} />;
    case "options":
      return <OptionsElement element={element} />;
    default:
      return null;
  }
}
