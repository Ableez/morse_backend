"use client";

import { CanvasElement } from "./canvas-elements/canvas-element";
import { useEditor } from "./editor-context";
import { memo } from "react";
import { SlideNavigation } from "./slide-navigation";

export const Canvas = memo(function Canvas() {
  const { lesson, currentSlide } = useEditor();

  if (!lesson) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="relative aspect-video h-[73dvh] w-[27dvw] rounded-3xl border bg-white">
        <div className="space-y-4 py-4">
          {lesson.slides[currentSlide]?.elements?.map((element, index) => (
            <CanvasElement key={element.id} element={element} index={index} />
          ))}
        </div>
      </div>

      <SlideNavigation />
    </div>
  );
});
