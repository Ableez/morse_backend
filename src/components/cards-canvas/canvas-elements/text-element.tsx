"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "../editor-context";
import type { TextElement } from "@/types/swipe-data";

type TextElementProps = {
  element: TextElement;
};ac

export function TextElement({ element }: TextElementProps) {
  const { updateElement } = useEditor();
  const ref = useRef<HTMLDivElement>(null);

  // init cnts and updates
  useEffect(() => {
    if (ref.current && element.content) {
      ref.current.textContent = element.content;
    }
  }, [element.content]);

  const handleBlur = () => {
    if (ref.current) {
      updateElement(element.id, {
        content: ref.current.textContent ?? "",
      });
    }
  };

  const className = `outline-none ${getAlignmentClass(element.align)} ${
    element.variant === "bold" ? "font-bold text-2xl" : "text-base"
  }`;

  return element.variant === "bold" ? (
    <h2
      ref={ref}
      className={className}
      contentEditable
      onBlur={handleBlur}
      suppressContentEditableWarning
    />
  ) : (
    <p
      ref={ref}
      className={className}
      contentEditable
      onBlur={handleBlur}
      suppressContentEditableWarning
    />
  );
}

//  function for tailwind class resolution
const getAlignmentClass = (align: string) => {
  switch (align) {
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "text-left";
  }
};
