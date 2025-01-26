/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { type Lesson } from "@/app/types/editor";
import { arrayMove } from "@/lib/utils";
import {
  titlesArr,
  type CardContentType,
  type ContentElement,
  type ElementType,
  type TextType,
} from "@/types/swipe-data";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface EditorContextType {
  lesson: Lesson | null;
  currentSlide: number;
  selectedElement: string | null;
  hasUnsavedChanges: boolean;
  setCurrentSlide: (index: number) => void;
  setSelectedElement: (id: string | null) => void;
  updateLesson: (updatedLesson: Partial<Lesson>) => void;
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
  addKatexExpression: (content: string, displayMode?: boolean) => void;
  getElementType: (elementId: string) => ElementType | null;
  lessonProgress: number;
  estimatedDuration: number;
  recommendedSlideCount: number;
}

const EditorContext = createContext<EditorContextType | null>(null);

const defaultLesson: Lesson = {
  id: crypto.randomUUID(),
  title: "Building Expressions",
  description: "Start your algebra journey here...",
  path: "Path",
  level: "Level 1",
  course: "Course",
  duration: 0,
  slides: [
    {
      id: crypto.randomUUID(),
      title: titlesArr[Math.floor(Math.random() * titlesArr.length)],
      elements: [
        {
          id: crypto.randomUUID(),
          type: "text",
          content: "Start writing.",
          align: "left",
          variant: "default",
          width: "fill",
        },
      ],
      index: 0,
      type: "info",
    },
  ],
  pathId: "",
  levelId: "",
  courseId: "",
};

type LocalSVLesson = { timestamp: Date; data: Lesson };

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const searchParams = useSearchParams();

  const recommendedSlideCount = 10;
  const lessonProgress = lesson
    ? Math.min((lesson.slides.length / recommendedSlideCount) * 100, 100)
    : 0;
  const estimatedDuration = lesson
    ? Math.ceil(lesson.slides.length * 0.75) // 45 seconds per slide
    : 0;

  useEffect(() => {
    console.log("RE-RENDERING...");
    const pathId = searchParams.get("pathId")?.split("__");
    const levelId = searchParams.get("levelId")?.split("__");
    const courseId = searchParams.get("courseId")?.split("__");
    const savedLesson = localStorage.getItem("currentLesson");
    const parsedLesson = savedLesson
      ? (JSON.parse(savedLesson) as LocalSVLesson)
      : null;

    if (
      parsedLesson &&
      new Date(parsedLesson.timestamp).getTime() > Date.now() - 5000
    ) {
      setLesson(parsedLesson.data);
      return;
    }

    const newLesson: Lesson = {
      ...defaultLesson,
      path: pathId?.[1] ?? "Path",
      level: levelId?.[1] ?? "Level 1",
      course: courseId?.[1] ?? "Course",
      pathId: pathId?.[0] ?? "",
      levelId: levelId?.[0] ?? "",
      courseId: courseId?.[0] ?? "",
    };

    setLesson(newLesson);
    localStorage.setItem(
      "currentLesson",
      JSON.stringify({
        timestamp: Date.now(),
        data: newLesson,
      }),
    );
  }, []);

  const updateLesson = useCallback((updatedLesson: Partial<Lesson>) => {
    setLesson((prev) => ({
      ...(prev ?? defaultLesson),
      ...updatedLesson,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addSlide = useCallback(() => {
    setLesson((prev) => {
      if (!prev) return prev;

      const randomTitle =
        titlesArr[Math.floor(Math.random() * titlesArr.length)];
      const newSlide: CardContentType = {
        id: crypto.randomUUID(), // Use proper UUID
        title: randomTitle,
        elements: [],
        index: prev.slides.length, // Correct index
        type: "info",
      };

      return {
        ...prev,
        slides: [...prev.slides, newSlide],
      };
    });
    setHasUnsavedChanges(true);
  }, []);

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

  const addKatexExpression = (content: string, displayMode = false) => {
    const katexElement: ContentElement = {
      id: crypto.randomUUID(),
      type: "katex",
      variant: displayMode ? "display-math" : "inline-math",
      content: content || "\\sqrt{a^2 + b^2}",
      align: "center",
      width: "hug",
    };

    addElementToSlide(katexElement);
  };

  const addImage = (uri: string) => {
    const imageElement: ContentElement = {
      id: crypto.randomUUID(),
      type: "image",
      uri:
        uri ??
        "https://adaptcommunitynetwork.org/wp-content/uploads/2022/01/ef3-placeholder-image.jpg",
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

    updateLesson({});
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
      localStorage.setItem(
        "currentLesson",
        JSON.stringify({ timestamp: Date.now(), data: lesson }),
      );
      console.log("saved LESSON", lesson);
      setHasUnsavedChanges(false);
    }
  };

  const getElementType = (elementId: string): ElementType | null => {
    return (
      lesson?.slides[currentSlide]?.elements?.find((el) => el.id === elementId)
        ?.type ?? null
    );
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
        addKatexExpression,
        getElementType,
        lessonProgress,
        estimatedDuration,
        recommendedSlideCount,
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
