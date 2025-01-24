"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "./editor-context";
import {
  IconChevronDown,
  IconChevronUp,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconTrash,
} from "@tabler/icons-react";

interface FloatingToolbarProps {
  elementId: string;
}

export function FloatingToolbar({ elementId }: FloatingToolbarProps) {
  const { removeElement, addElementRelative } = useEditor();

  return (
    <div className="absolute -right-44 top-1/2 z-[999] flex -translate-y-1/2 gap-1 rounded-2xl border bg-white p-1 shadow-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "above");
        }}
      >
        <IconChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "below");
        }}
      >
        <IconChevronDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          addElementRelative(elementId, "text", "below");
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
