"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEditor } from "./cards-canvas/editor-context";
import { IconTrash } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

export function Sidebar() {
  const {
    lesson,
    currentSlide,
    setCurrentSlide,
    addSlide,
    removeSlide,
    reorderSlides,
    updateLesson,
    lessonProgress,
    recommendedSlideCount,
    estimatedDuration,
  } = useEditor();
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderSlides(result.source.index, result.destination.index);
  };

  const handleBlur = () => {
    if (ref.current) {
      updateLesson({
        title: ref.current.textContent ?? "",
      });
    }
  };

  console.log("PROGRESS", lessonProgress);
  if (!lesson) return null;
  return (
    <div className="fixed left-2 top-1/2 z-[49] my-auto h-[90dvh] w-64 -translate-y-1/2 rounded-2xl border bg-white py-4 shadow-2xl">
      <div className="px-4">
        <div
          className={
            "mb-4 flex h-2 w-full justify-start overflow-clip rounded-full bg-neutral-200"
          }
        >
          <div
            style={{ width: `${lessonProgress}%` }}
            className={`mb-4 h-2 rounded-full ${lessonProgress > 30 && lessonProgress <= 80 ? "bg-green-500" : lessonProgress === 10 || lessonProgress >= 90 ? "bg-red-500" : "bg-orange-500"}`}
          />
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2 px-4">
        <span className="text-sm font-medium">
          {lesson.slides.length} Slides
        </span>
        <span className="text-sm font-medium text-gray-500">
          {estimatedDuration} mins
        </span>
      </div>
      <div className="mb-6 px-4">
        <h2
          ref={ref}
          className="mb-2 rounded-xl bg-blue-50 px-2.5 py-1 font-semibold outline-blue-400 ring-2 ring-blue-100"
          contentEditable
          onBlur={handleBlur}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: lesson.title }}
        />
        <div className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          {lesson.path} • {lesson.level ?? "Level"} • {lesson.course}
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slides">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="max-h-[50dvh] space-y-2 overflow-y-scroll px-4"
              style={{
                scrollbarWidth: "none",
              }}
            >
              {lesson.slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`cursor-move rounded-2xl px-2 py-0.5 shadow-none ${currentSlide === index ? "bg-gradient-to-r from-red-100 via-neutral-100 to-neutral-100" : ""} flex place-items-center gap-3 overflow-clip align-middle`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <button
                        className={` ${currentSlide === index ? "flex aspect-square translate-x-0 place-items-center rounded-full p-1.5 align-middle opacity-100 hover:bg-red-200" : "-translate-x-4 opacity-0"} transition-all duration-300 ease-out`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSlide(slide.id);
                        }}
                      >
                        <IconTrash width={18} color={"red"} />
                      </button>

                      <div
                        className={`${currentSlide === index ? "translate-x-0" : "-translate-x-6"} flex w-full items-center justify-between transition-all duration-300 ease-out`}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span>{index + 1}</span>
                          <span
                            className={`truncate ${currentSlide === index ? "w-16" : "w-[4.9rem]"} text-xs`}
                          >
                            {slide.title}
                          </span>
                        </div>
                        <div
                          className={`${currentSlide === index ? "translate-x-0" : "translate-x-6"} transition-all duration-300 ease-out`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              reorderSlides(index, index + 1);
                              toast({
                                description: `Moved down`,
                              });
                            }}
                            disabled={index === lesson.slides.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              reorderSlides(index, index - 1);
                              toast({
                                description: `Moved up`,
                              });
                            }}
                            disabled={index === 0}
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

      <div className="px-4">
        <Button
          className="mt-4 w-full bg-green-500 text-white hover:bg-green-600"
          onClick={addSlide}
          disabled={lesson.slides.length >= recommendedSlideCount}
        >
          <Plus className="mr-2 h-4 w-4" />
          New slide
        </Button>
      </div>
    </div>
  );
}
