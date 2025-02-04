"use client";

import { Canvas } from "#/components/cards-canvas/canvas";
import { EditorProvider } from "#/components/cards-canvas/editor-context";
import { Sidebar } from "#/components/sidebar";
import { Toolbar } from "#/components/cards-canvas/toolbar";
import { use } from "react";

export default function Editor({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);

  if (!lessonId.split("__").includes("new")) {
    return <div>Edit existing lesson later</div>;
  }

  return (
    <EditorProvider>
      <div className="relative flex h-screen bg-slate-200/60">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Canvas />
        </div>
        <Toolbar />
      </div>
    </EditorProvider>
  );
}
