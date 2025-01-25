"use client";

import { ElementRenderer } from "../element-renderer";
import { FloatingToolbar } from "../floating-toolbar";
import { useEditor } from "../editor-context";
import { memo } from "react";
import type { ContentElement } from "@/types/swipe-data";

type CanvasElementProps = {
  element: ContentElement;
  index: number;
};

export const CanvasElement = memo(function CanvasElement({
  element,
}: CanvasElementProps) {
  const { selectedElement, setSelectedElement } = useEditor();

  return (
    <div>
      <div
        className={`group relative ${selectedElement === element.id ? "ring-1 ring-blue-500" : ""} p-6`}
        style={{
          paddingTop: element.topSpace ?? 0,
          paddingBottom: element.bottomSpace ?? 0,
        }}
        onClick={() => setSelectedElement(element.id)}
      >
        <ElementRenderer element={element} />
        {selectedElement === element.id && (
          <FloatingToolbar elementId={element.id} />
        )}
      </div>
    </div>
  );
});
