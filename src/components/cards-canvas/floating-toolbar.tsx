// floating-toolbar.tsx
"use client";

import { Button } from "#/components/ui/button";
import { useEditor } from "./editor-context";
import {
  IconChevronDown,
  IconChevronUp,
  IconPhotoEdit,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconTrash,
} from "@tabler/icons-react";
import { useAddImageElementDialog } from "#/hooks/use-add-image-element-dialog";
import { XIcon } from "lucide-react";

interface FloatingToolbarProps {
  elementId: string;
}

export function FloatingToolbar({ elementId }: FloatingToolbarProps) {
  const {
    lesson,
    currentSlide,
    removeElement,
    addElementRelative,
    moveElementUp,
    moveElementDown,
    getElementType,
    updateElement,
    setSelectedElement,
  } = useEditor();
  const elementType = getElementType(elementId);

  const onUploadComplete = (url: string) => {
    updateElement(elementId, { uri: url });
  };

  const [, setOpen, renderElement] = useAddImageElementDialog({
    onUploadComplete,
  });

  return (
    <div className="absolute -right-44 top-1/2 z-[49] flex -translate-y-1/2 gap-1 rounded-2xl border bg-white p-1 shadow-2xl">
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 rounded-full active:bg-red-100"
        onClick={() => {
          setSelectedElement(null);
        }}
      >
        <XIcon className="h-4 w-4 text-red-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setOpen(true);
        }}
      >
        <IconPhotoEdit className="h-4 w-4" />
      </Button>
      {elementType === "image" && renderElement()}

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          moveElementUp(elementId);
        }}
        disabled={
          !lesson?.slides[currentSlide]?.elements?.some(
            (el, index, arr) => el.id === elementId && index === arr.length - 1,
          )
        }
      >
        <IconChevronUp className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          moveElementDown(elementId);
        }}
        disabled={
          !lesson?.slides[currentSlide]?.elements?.some(
            (el, index, arr) =>
              (el.id === elementId && index !== 0) || index === arr.length - 1,
          )
        }
      >
        <IconChevronDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "above");
        }}
      >
        <IconRowInsertTop className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "below");
        }}
      >
        <IconRowInsertBottom className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          removeElement(elementId);
        }}
      >
        <IconTrash color={"#eb0000"} className="h-4 w-4" />
      </Button>
    </div>
  );
}
