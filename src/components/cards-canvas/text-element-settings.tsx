"use client";

import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { useEditor } from "./editor-context";
import { memo } from "react";
import type { ContentElement } from "#/types/swipe-data";

const ALIGNMENT_OPTIONS = [
  { value: "left", Icon: AlignLeft },
  { value: "center", Icon: AlignCenter },
  { value: "right", Icon: AlignRight },
  { value: "justify", Icon: AlignJustify },
] as const;

type TextElementSettingsProps = {
  element: ContentElement & { content: string };
};

export const TextElementSettings = memo(function TextElementSettings({
  element,
}: TextElementSettingsProps) {
  const { updateElement } = useEditor();

  return (
    <>
      <Input
        value={element.content}
        onChange={(e) => updateElement(element.id, { content: e.target.value })}
        placeholder="Enter text"
      />

      <div>
        <label className="text-sm text-gray-500">Text Alignment</label>
        <div className="mt-1 flex gap-2">
          {ALIGNMENT_OPTIONS.map(({ value, Icon }) => (
            <Button
              key={value}
              variant={element.align === value ? "default" : "outline"}
              size="icon"
              onClick={() => updateElement(element.id, { align: value })}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </>
  );
});
