"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditor } from "./editor-context";
import { memo } from "react";

export const SlideNavigation = memo(function SlideNavigation() {
  const { lesson, currentSlide, setCurrentSlide } = useEditor();
  const totalSlides = lesson?.slides.length ?? 0;

  if (!lesson) return null;

  return (
    <div className="mt-4 flex items-center gap-4">
      <button
        className="rounded-2xl border bg-white px-6 py-3 hover:bg-white/50 disabled:bg-white/50 disabled:text-neutral-500"
        disabled={currentSlide === 0}
        onClick={() => setCurrentSlide(currentSlide - 1)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-sm font-medium">
        Slide {currentSlide + 1} of {totalSlides}
      </span>

      <button
        className="rounded-2xl border bg-white px-6 py-3 hover:bg-white/50 disabled:bg-white/50 disabled:text-neutral-500"
        disabled={currentSlide === totalSlides - 1}
        onClick={() => setCurrentSlide(currentSlide + 1)}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
});
