"use client";

import type { ContentElement } from "@/types/swipe-data";

type TextElementProps = {
  element: ContentElement & { content: string; variant: string };
};

export function TextElement({ element }: TextElementProps) {
  if (!element.content) return null;

  const className = `text-${element.align} ${
    element.variant === "bold" ? "font-bold text-2xl" : ""
  }`;

  return element.variant === "bold" ? (
    <h2 defaultValue={element.content} contentEditable className={className} />
  ) : (
    <p contentEditable className={className} defaultValue={element.content} />
  );
}
