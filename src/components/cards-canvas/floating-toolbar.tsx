// floating-toolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "./editor-context";
import {
  IconChevronDown,
  IconChevronUp,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconTrash,
} from "@tabler/icons-react";

interface FloatingToolbarProps {
  elementId: string;
}

export function FloatingToolbar({ elementId }: FloatingToolbarProps) {
  const {
    lesson,
    currentSlide,
    removeElement,
    addElementRelative,
    reorderElements,
  } = useEditor();

  const handleMoveUp = () => {
    if (!lesson) return;
    const elements = lesson.slides[currentSlide]?.elements ?? [];
    const currentIndex = elements.findIndex((el) => el.id === elementId);

    if (currentIndex > 0) {
      reorderElements(currentIndex, currentIndex - 1);
    }
  };

  const handleMoveDown = () => {
    if (!lesson) return;
    const elements = lesson.slides[currentSlide]?.elements ?? [];
    const currentIndex = elements.findIndex((el) => el.id === elementId);

    if (currentIndex < elements.length - 1) {
      reorderElements(currentIndex, currentIndex + 1);
    }
  };

  return (
    <div className="absolute -right-44 top-1/2 z-[999] flex -translate-y-1/2 gap-1 rounded-2xl border bg-white p-1 shadow-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          handleMoveUp();
        }}
        disabled={
          !lesson?.slides[currentSlide]?.elements?.some(
            (el, index) => el.id === elementId && index === 0,
          )
        }
      >
        <IconChevronUp className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          handleMoveDown();
        }}
        disabled={
          !lesson?.slides[currentSlide]?.elements?.some(
            (el, index, arr) => el.id === elementId && index === arr.length - 1,
          )
        }
      >
        <IconChevronDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "below");
        }}
      >
        <IconRowInsertTop className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "below");
        }}
      >
        <IconRowInsertBottom className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          removeElement(elementId);
        }}
      >
        <IconTrash color={"#eb0000"} className="h-4 w-4" />
      </Button>
    </div>
  );
}
