"use client";

import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { CanvasElement } from "./canvas-elements/canvas-element";
import { useEditor } from "./editor-context";
import { useCallback, memo } from "react";
import { SlideNavigation } from "./slide-navigation";

export const Canvas = memo(function Canvas() {
  const { lesson, currentSlide, reorderElements } = useEditor();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      reorderElements(result.source.index, result.destination.index);
    },
    [reorderElements],
  );

  if (!lesson) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="relative aspect-video h-[70dvh] w-[27dvw] rounded-3xl border bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="elements">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 p-4"
              >
                {lesson.slides[currentSlide]?.elements?.map(
                  (element, index) => (
                    <CanvasElement
                      key={element.id}
                      element={element}
                      index={index}
                    />
                  ),
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <SlideNavigation />
    </div>
  );
});
