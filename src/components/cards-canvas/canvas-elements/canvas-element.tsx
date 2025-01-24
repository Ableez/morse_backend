"use client";

import { Draggable } from "@hello-pangea/dnd";
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
  index,
}: CanvasElementProps) {
  const { selectedElement, setSelectedElement } = useEditor();

  return (
    <Draggable draggableId={element.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative ${selectedElement === element.id ? "ring-1 ring-blue-500" : ""}`}
          onClick={() => setSelectedElement(element.id)}
        >
          <ElementRenderer element={element} />
          {selectedElement === element.id && (
            <FloatingToolbar elementId={element.id} />
          )}
        </div>
      )}
    </Draggable>
  );
});
