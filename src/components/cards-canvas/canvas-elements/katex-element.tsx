"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "../editor-context";
import type { TextElement } from "#/types/swipe-data";
import katex from "katex";
import "katex/dist/katex.min.css";

type KatexElementProps = {
  element: TextElement;
};

export function KatexElement({ element }: KatexElementProps) {
  const { updateElement } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDisplayMode = element.variant === "display-math";

  useEffect(() => {
    if (containerRef.current && element.content) {
      try {
        katex.render(element.content, containerRef.current, {
          displayMode: isDisplayMode,
          throwOnError: false,
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
      }
    }
  }, [element.content, isDisplayMode]);

  return (
    <div
      ref={containerRef}
      className={`${isDisplayMode ? "my-4 block w-full" : "inline"} cursor-pointer`}
      onClick={() =>
        updateElement(element.id, {
          content: prompt("Edit LaTeX:", element.content) ?? element.content,
        })
      }
    />
  );
}
