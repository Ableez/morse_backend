"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEditor } from "./editor-context";

export function Sidebar() {
  const {
    lesson,
    currentSlide,
    setCurrentSlide,
    addSlide,
    removeSlide,
    reorderSlides,
  } = useEditor();

  if (!lesson) return null;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderSlides(result.source.index, result.destination.index);
  };

  return (
    <div className="w-64 h-[90dvh] my-auto rounded-2xl border shadow-2xl bg-white p-4 left-2 fixed left-0 top-1/2 -translate-y-1/2 z-[99]">
      <div className="mb-4 h-1 w-1/3 rounded-full bg-green-500" />
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm">{lesson.slides.length} Slides</span>
        <span className="text-sm text-gray-500">{lesson.duration} mins</span>
      </div>
      <div className="mb-6">
        <Image
          src="/placeholder.svg"
          alt="Course Icon"
          width={48}
          height={48}
          className="mb-2"
        />
        <div className="text-sm text-gray-500">
          {lesson.path} • {lesson.level} • {lesson.course}
        </div>
        <h1 className="font-semibold">{lesson.title}</h1>
        <p className="text-sm text-gray-500">{lesson.description}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {lesson.slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`cursor-pointer p-3 ${currentSlide === index ? "border-red-200 bg-red-50" : ""}`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{index + 1}</span>
                          <span>{slide.title}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSlide(slide.id);
                            }}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        className="mt-4 w-full bg-green-500 text-white hover:bg-green-600"
        onClick={addSlide}
      >
        <Plus className="mr-2 h-4 w-4" />
        New slide
      </Button>
    </div>
  );
}
