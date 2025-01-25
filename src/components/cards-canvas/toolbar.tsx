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
    <aside className="z-[99]-translate-y-1/2 fixed right-2 top-1/2 -translate-y-1/2 rounded-2xl border bg-white shadow-2xl">
      <div className="relative h-[90dvh] w-72 space-y-4 overflow-y-scroll p-4 pb-14">
        <ToolbarHeader />
        <ElementCreationButtons />
        {currentElement && <ElementSettings element={currentElement} />}

        <div className="fixed -bottom-0.5 left-0 z-[99] h-14 w-full rounded-b-2xl bg-gradient-to-t from-white to-white/0" />
      </div>
    </aside>
  );
});
