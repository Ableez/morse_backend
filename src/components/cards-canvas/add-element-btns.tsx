// element-creation-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Type, ImageIcon, List } from "lucide-react";
import { IconSlideshow } from "@tabler/icons-react";
import { useEditor } from "./editor-context";
import { memo } from "react";

export const ElementCreationButtons = memo(function ElementCreationButtons() {
  const { addText, addImage, addCarousel, addOptions } = useEditor();

  return (
    <div className="space-y-2">
      <ToolbarButton
        label="Add Bold Text"
        Icon={Type}
        onClick={() => addText("Bold text", "bold")}
      />
      <ToolbarButton
        label="Add Text"
        Icon={Type}
        onClick={() => addText("Default text", "default")}
      />
      <ToolbarButton
        label="Add Image"
        Icon={ImageIcon}
        onClick={() => addImage("https://example.com/placeholder.jpg")}
      />
      <ToolbarButton
        label="Add Carousel"
        Icon={IconSlideshow}
        onClick={() => addCarousel([], true, true)}
      />
      <ToolbarButton
        label="Add Options"
        Icon={List}
        onClick={() => addOptions(["Option 1", "Option 2"], 0)}
      />
    </div>
  );
});

const ToolbarButton = memo(function ToolbarButton({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <Button
      className="w-full justify-between"
      variant="ghost"
      onClick={onClick}
    >
      {label}
      <Icon className="h-4 w-4" />
    </Button>
  );
});
