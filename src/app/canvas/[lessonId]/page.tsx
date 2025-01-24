"use client";

import { Canvas } from "@/components/canvas";
import { EditorProvider } from "@/components/editor-context";
import { Sidebar } from "@/components/sidebar";
import { Toolbar } from "@/components/toolbar";
import { use } from "react";

export default function Editor({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);

  if (lessonId !== "new") {
    return <div>Edit existing lesson later</div>;
  }

  return (
    <EditorProvider>
      <div className="flex h-screen bg-slate-200/60 relative">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Canvas />
        </div>
        <Toolbar />
      </div>
    </EditorProvider>
  );
}
