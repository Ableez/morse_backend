"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FloatingToolbar } from "./floating-toolbar";
import { useEditor } from "./editor-context";
import Image from "next/image";

export function Canvas() {
  const {
    lesson,
    currentSlide,
    selectedElement,
    setCurrentSlide,
    setSelectedElement,
    reorderElements,
  } = useEditor();

  if (!lesson) return null;

  const slide = lesson.slides[currentSlide];
  const totalSlides = lesson.slides.length;

  const handleDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return;
    reorderElements(result.source.index, result.destination.index);
  };

  return (
    <div className="flex flex-1 flex-col place-items-center items-center justify-center p-8">
      <div className="relative aspect-video h-[70dvh] w-[27dvw] rounded-3xl border bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="elements">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {slide?.elements?.map((element, index) => (
                  <Draggable
                    key={element.id}
                    draggableId={element.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`group relative ${selectedElement === element.id ? "ring-1 ring-blue-500" : ""}`}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        {element.type === "text" && (
                          <h2 className="text-2xl font-bold">
                            {element.content}
                          </h2>
                        )}
                        {element.type === "text" && (
                          <p className={`text-${element.align}`}>
                            {element.content}
                          </p>
                        )}
                        {element.type === "image" && (
                          <Image
                            fill
                            src={element.uri ?? "/placeholder.svg"}
                            alt="Slide content"
                            className={`${element.width === "fill" ? "w-full" : "w-auto"}`}
                          />
                        )}
                        {element.type === "carousel" && (
                          <div className="flex gap-4 overflow-x-auto">
                            {element.images?.map((image, i) => (
                              <Image
                                key={i}
                                src={image ?? "/placeholder.svg"}
                                alt={`Carousel ${i + 1}`}
                                className="w-64"
                              />
                            ))}
                          </div>
                        )}
                        {element.type === "options" && (
                          <ul className="space-y-2">
                            {element.choices?.map((choice, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`choices-${element.id}`}
                                />
                                <span>{choice}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {selectedElement === element.id && (
                          <FloatingToolbar elementId={element.id} />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          className="cursor-pointer rounded-2xl border bg-white px-6 py-3 text-black hover:bg-white/50 disabled:bg-white/50 disabled:text-neutral-500"
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide(currentSlide - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span>
          {currentSlide + 1} of {totalSlides}
        </span>
        <button
          className="cursor-pointer rounded-2xl border bg-white px-6 py-3 text-black hover:bg-white/50 disabled:bg-white/50 disabled:text-neutral-500"
          disabled={currentSlide === totalSlides - 1}
          onClick={() => setCurrentSlide(currentSlide + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
