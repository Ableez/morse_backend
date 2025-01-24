// element-width-control.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "./editor-context";
import { memo } from "react";
import type { ContentElement } from "@/types/swipe-data";

type ElementWidthControlProps = {
  element: ContentElement;
};

export const ElementWidthControl = memo(function ElementWidthControl({
  element,
}: ElementWidthControlProps) {
  const { updateElement } = useEditor();

  return (
    <div>
      <label className="text-sm text-gray-500">Width</label>
      <Button
        className="mt-1 w-full"
        variant={element.width === "fill" ? "default" : "outline"}
        onClick={() =>
          updateElement(element.id, {
            width: element.width === "fill" ? "hug" : "fill",
          })
        }
      >
        {element.width === "fill" ? "Fill container" : "Auto width"}
      </Button>
    </div>
  );
});
