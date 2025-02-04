"use client";

import { TextElement } from "./canvas-elements/text-element";
import type {
  CarouselElement as CarouselElementType,
  ContentElement as ContentElementType,
  ImageElement as ImageElementType,
  OptionsElement as OptionsElementType,
} from "#/types/swipe-data";
import { ImageElement } from "./canvas-elements/image-element";
import { OptionsElement } from "./canvas-elements/option-element";
import { KatexElement } from "./canvas-elements/katex-element";
import { CarouselElement } from "./canvas-elements/carousel-element";

type ElementRendererProps = {
  element: ContentElementType;
};

export function ElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    case "text":
      return <TextElement element={element} />;
    case "katex":
      return <KatexElement element={element} />;
    case "image":
      return <ImageElement element={element as ImageElementType} />;
    case "carousel":
      return <CarouselElement element={element as CarouselElementType} />;
    case "options":
      return <OptionsElement element={element as OptionsElementType} />;
    default:
      return null;
  }
}
