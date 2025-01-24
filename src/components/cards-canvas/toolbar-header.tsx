// toolbar-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEditor } from "./editor-context";
import { memo } from "react";

export const ToolbarHeader = memo(function ToolbarHeader() {
  const { hasUnsavedChanges, saveLesson } = useEditor();

  return (
    <div className="space-y-4">
      {hasUnsavedChanges && <UnsavedChangesAlert />}

      <Button className="w-full bg-green-500 text-white hover:bg-green-600">
        Submit for review
      </Button>
      <Button className="w-full" variant="outline">
        Publish lesson
      </Button>
      <Button className="w-full" variant="outline" onClick={saveLesson}>
        Save, don&apos;t publish
      </Button>
    </div>
  );
});

const UnsavedChangesAlert = memo(function UnsavedChangesAlert() {
  return (
    <div className="flex items-center rounded bg-red-50 p-2 text-sm text-red-500">
      <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
      You have unsaved changes
    </div>
  );
});
