"use client";

import { useEditor } from "./editor-context";
import { memo, useMemo } from "react";
import { ToolbarHeader } from "./toolbar-header";
import { ElementCreationButtons } from "./add-element-btns";
import { ElementSettings } from "./element-settings";

export const Toolbar = memo(function Toolbar() {
  const { lesson, currentSlide, selectedElement } = useEditor();

  const currentElement = useMemo(() => {
    if (!lesson || !selectedElement) return null;
    return lesson.slides[currentSlide]?.elements?.find(
      (el) => el.id === selectedElement,
    );
  }, [lesson, currentSlide, selectedElement]);

  if (!lesson) return null;

  return (
    <aside className="fixed right-2 top-1/2 z-[99] h-[90dvh] w-72 -translate-y-1/2 space-y-4 overflow-y-auto rounded-2xl border bg-white p-4 shadow-2xl">
      <ToolbarHeader />
      <ElementCreationButtons />
      {currentElement && <ElementSettings element={currentElement} />}
    </aside>
  );
});
