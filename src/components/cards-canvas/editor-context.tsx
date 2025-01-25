"use client";

import { type Lesson } from "@/app/types/editor";
import { arrayMove } from "@/lib/utils";
import type {
  CardContentType,
  ContentElement,
  ElementType,
  TextType,
} from "@/types/swipe-data";
import { createContext, useContext, useState, useEffect } from "react";

interface EditorContextType {
  lesson: Lesson | null;
  currentSlide: number;
  selectedElement: string | null;
  hasUnsavedChanges: boolean;
  setCurrentSlide: (index: number) => void;
  setSelectedElement: (id: string | null) => void;
  updateLesson: (updatedLesson: Lesson) => void;
  addSlide: () => void;
  removeSlide: (slideId: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  updateElement: (elementId: string, updates: Partial<ContentElement>) => void;
  removeElement: (elementId: string) => void;
  reorderElements: (startIndex: number, endIndex: number) => void;
  addElementRelative: (
    elementId: string,
    type: ElementType,
    position: "above" | "below",
  ) => void;
  addText: (text: string, variant: TextType) => void;
  addImage: (uri: string) => void;
  addExpression: (latex: string) => void;
  addOptions: (choices: string[], correctAnswer: number) => void;
  addCarousel: (images: string[], arr: boolean, showDots: boolean) => void;
  saveLesson: () => void;
  moveElementUp: (elementId: string) => void;
  moveElementDown: (elementId: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

const defaultLesson: Lesson = {
  id: "1",
  title: "Building Expressions",
  description:
    "Start your algebra journey here with an introduction to variables and equations.",
  path: "Path",
  level: "Level 1",
  course: "Course",
  duration: 6,
  slides: [
    {
      id: "1",
      title: "Summary",
      elements: [
        {
          id: "1",
          type: "image",
          uri: "https://ds055uzetaobb.cloudfront.net/brioche/uploads/Solving-Equations_13_3475-7025_LdhXDP.png?width=1080",
          width: "fill",
          align: "center",
        },
        {
          id: "2",
          type: "text",
          content:
            "Combinations of known and unknown values are the building blocks equations. Let's get building.",
          align: "left",
          variant: "default",
          width: "fill",
        },
      ],
      index: 0,
      type: "info",
    },
  ],
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const savedLesson = localStorage.getItem("currentLesson");
    if (savedLesson) {
      setLesson(JSON.parse(savedLesson) as Lesson);
    } else {
      setLesson(defaultLesson);
      localStorage.setItem("currentLesson", JSON.stringify(defaultLesson));
    }
  }, []);

  const updateLesson = (updatedLesson: Lesson) => {
    setLesson(updatedLesson);
    setHasUnsavedChanges(true);
  };

  const addSlide = () => {
    if (!lesson) return;
    const newSlide: CardContentType = {
      id: Date.now().toString(),
      title: "Summary",
      elements: null,
      index: 0,
      type: "info",
    };
    updateLesson({
      ...lesson,
      slides: [...lesson.slides, newSlide],
    });
  };

  const removeSlide = (slideId: string) => {
    if (!lesson) return;
    updateLesson({
      ...lesson,
      slides: lesson.slides.filter((slide) => slide.id !== slideId),
    });
  };

  const reorderSlides = (startIndex: number, endIndex: number) => {
    if (!lesson) return;
    const newSlides = Array.from(lesson.slides);
    const [removed] = newSlides.splice(startIndex, 1);
    if (removed) {
      newSlides.splice(endIndex, 0, removed);
    }
    updateLesson({
      ...lesson,
      slides: newSlides,
    });
  };

  const addElementToSlide = (element: ContentElement) => {
    if (!lesson) return;

    const updatedSlides: CardContentType[] = lesson.slides.map(
      (slide, index) => {
        if (index === currentSlide) {
          return {
            ...slide,
            elements: slide.elements ? [...slide.elements, element] : [element],
          };
        }
        return slide;
      },
    );

    updateLesson({
      ...lesson,
      slides: updatedSlides,
    });
  };

  const addText = (text: string, variant: TextType) => {
    const textElement: ContentElement = {
      id: crypto.randomUUID(),
      type: "text",
      variant,
      content: text || (variant === "bold" ? "Bold text" : "Enter text"),
      align: "left",
      width: "fill",
    };

    addElementToSlide(textElement);
  };

  const addImage = (uri: string) => {
    const imageElement: ContentElement = {
      id: crypto.randomUUID(),
      type: "image",
      uri,
      width: "fill",
      align: "center",
    };
    addElementToSlide(imageElement);
  };

  const addExpression = (latex: string) => {
    const expressionElement: ContentElement = {
      id: crypto.randomUUID(),
      type: "expression",
      latex,
      width: "fill",
      align: "center",
    };
    addElementToSlide(expressionElement);
  };

  const addOptions = (choices: string[], correctAnswer: number) => {
    const choiceElement: ContentElement = {
      id: crypto.randomUUID(),
      type: "options",
      choices,
      correctAnswer,
      width: "fill",
      align: "center",
    };
    addElementToSlide(choiceElement);
  };

  const addCarousel = (images: string[], arr: boolean, showDots: boolean) => {
    const carouselElement: ContentElement = {
      id: crypto.randomUUID(),
      arr,
      images,
      showDots,
      type: "carousel",
      width: "fill",
      align: "center",
    };
    addElementToSlide(carouselElement);
  };

  const updateElement = (
    elementId: string,
    updates: Partial<ContentElement>,
  ) => {
    if (!lesson) return;

    const updatedSlides = lesson.slides.map((slide, index) => {
      if (index === currentSlide) {
        return {
          ...slide,
          elements:
            slide.elements?.map((element) =>
              element.id === elementId ? { ...element, ...updates } : element,
            ) ?? [],
        };
      }
      return slide;
    });

    updateLesson({
      ...lesson,
      slides: updatedSlides as CardContentType[],
    });
  };

  const removeElement = (elementId: string) => {
    if (!lesson) return;
    const updatedSlides = lesson.slides.map((slide, index) => {
      if (index === currentSlide) {
        return {
          ...slide,
          elements: slide.elements?.filter(
            (element) => element.id !== elementId,
          ),
        };
      }
      return slide;
    });
    updateLesson({
      ...lesson,
      slides: updatedSlides as CardContentType[],
    });
    setSelectedElement(null);
  };

  const reorderElements = (startIndex: number, endIndex: number) => {
    if (!lesson) return;
    const updatedSlides = lesson.slides.map((slide, index) => {
      if (index === currentSlide) {
        const newElements = Array.from(slide.elements ?? []);
        const [removed] = newElements.splice(startIndex, 1);
        if (removed) {
          newElements.splice(endIndex, 0, removed);
          return {
            ...slide,
            elements: newElements,
          };
        }
      }
      return slide;
    });
    updateLesson({
      ...lesson,
      slides: updatedSlides,
    });
  };

  // Implementation in EditorProvider
  const moveElementUp = (elementId: string) => {
    if (!lesson) return;

    const currentElements = lesson.slides[currentSlide]?.elements
      ? [...lesson.slides[currentSlide].elements]
      : [];
    const currentIndex = currentElements.findIndex((el) => el.id === elementId);

    if (currentIndex > 0) {
      const newElements = arrayMove(
        currentElements,
        currentIndex,
        currentIndex - 1,
      );
      const updatedSlides = lesson.slides.map((slide, index) =>
        index === currentSlide ? { ...slide, elements: newElements } : slide,
      );
      updateLesson({ ...lesson, slides: updatedSlides });
    }
  };

  const moveElementDown = (elementId: string) => {
    if (!lesson) return;

    const currentElements = lesson.slides[currentSlide]?.elements
      ? [...lesson.slides[currentSlide].elements]
      : [];
    const currentIndex = currentElements.findIndex((el) => el.id === elementId);

    if (currentIndex < currentElements.length - 1) {
      const newElements = arrayMove(
        currentElements,
        currentIndex,
        currentIndex + 1,
      );
      const updatedSlides = lesson.slides.map((slide, index) =>
        index === currentSlide ? { ...slide, elements: newElements } : slide,
      );
      updateLesson({ ...lesson, slides: updatedSlides });
    }
  };

  const addElementRelative = (
    elementId: string,
    type: ElementType,
    position: "above" | "below",
  ) => {
    if (!lesson) return;
    const newElement: ContentElement = {
      id: Date.now().toString(),
      type,
      ...(type === "text" ? { content: "New text", variant: "default" } : {}),
      align: "left",
      width: "fill",
    } as ContentElement;

    const updatedSlides = lesson.slides.map((slide, index) => {
      if (index === currentSlide) {
        const elementIndex =
          slide.elements?.findIndex((el) => el.id === elementId) ?? -1;
        if (elementIndex === -1) return slide;

        const newElements = [...(slide.elements ?? [])];
        newElements.splice(
          position === "above" ? elementIndex : elementIndex + 1,
          0,
          newElement,
        );
        return {
          ...slide,
          elements: newElements,
        };
      }
      return slide;
    });
    updateLesson({
      ...lesson,
      slides: updatedSlides,
    });
  };

  const saveLesson = () => {
    if (lesson) {
      localStorage.setItem("currentLesson", JSON.stringify(lesson));
      setHasUnsavedChanges(false);
    }
  };

  return (
    <EditorContext.Provider
      value={{
        lesson,
        currentSlide,
        selectedElement,
        hasUnsavedChanges,
        setCurrentSlide,
        setSelectedElement,
        updateLesson,
        addSlide,
        removeSlide,
        reorderSlides,
        addCarousel,
        addExpression,
        addText,
        addImage,
        addOptions,
        updateElement,
        removeElement,
        reorderElements,
        addElementRelative,
        saveLesson,
        moveElementDown,
        moveElementUp,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }

  return context;
};
