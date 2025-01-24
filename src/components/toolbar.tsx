"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  ImageIcon,
  List,
  FileSlidersIcon as Slideshow,
} from "lucide-react"
import { useEditor } from "./editor-context"

export function Toolbar() {
  const { lesson, selectedElement, hasUnsavedChanges, addElement, updateElement, saveLesson } = useEditor()

  if (!lesson) return null

  const currentElement = selectedElement
    ? lesson.slides[lesson.currentSlideId]?.elements.find((el) => el.id === selectedElement)
    : null

  return (
    <div className="w-72 bg-white p-4 border shadow-2xl z-[99] space-y-4 fixed right-2 h-[90dvh] top-1/2 -translate-y-1/2 rounded-2xl">
      {hasUnsavedChanges && (
        <div className="bg-red-50 text-red-500 p-2 rounded text-sm flex items-center">
          <span className="h-2 w-2 bg-red-500 rounded-full mr-2" />
          you have unsaved changes
        </div>
      )}
      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Submit for review</Button>
      <Button className="w-full" variant="outline">
        Publish lesson
      </Button>
      <Button className="w-full" variant="outline" onClick={saveLesson}>
        Save, don't publish
      </Button>

      <div className="space-y-2">
        <Button className="w-full justify-between" variant="ghost" onClick={() => addElement("bold-text")}>
          Add Bold text
          <Type className="h-4 w-4" />
        </Button>
        <Button className="w-full justify-between" variant="ghost" onClick={() => addElement("text")}>
          Add text
          <Type className="h-4 w-4" />
        </Button>
        <Button className="w-full justify-between" variant="ghost" onClick={() => addElement("image")}>
          Add Image
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button className="w-full justify-between" variant="ghost" onClick={() => addElement("carousel")}>
          Add carousel
          <Slideshow className="h-4 w-4" />
        </Button>
        <Button className="w-full justify-between" variant="ghost" onClick={() => addElement("options")}>
          Add options
          <List className="h-4 w-4" />
        </Button>
      </div>

      {currentElement && (
        <div className="space-y-4">
          {(currentElement.type === "text" || currentElement.type === "bold-text") && (
            <>
              <Input
                value={currentElement.content}
                onChange={(e) => updateElement(currentElement.id, { content: e.target.value })}
                placeholder="Enter text"
              />
              <div>
                <label className="text-sm text-gray-500">Text alignment</label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={currentElement.align === "left" ? "default" : "outline"}
                    size="icon"
                    onClick={() => updateElement(currentElement.id, { align: "left" })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={currentElement.align === "center" ? "default" : "outline"}
                    size="icon"
                    onClick={() => updateElement(currentElement.id, { align: "center" })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={currentElement.align === "right" ? "default" : "outline"}
                    size="icon"
                    onClick={() => updateElement(currentElement.id, { align: "right" })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={currentElement.align === "justify" ? "default" : "outline"}
                    size="icon"
                    onClick={() => updateElement(currentElement.id, { align: "justify" })}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-gray-500">Width</label>
            <Button
              className="w-full mt-1"
              variant={currentElement.width === "fill" ? "default" : "outline"}
              onClick={() =>
                updateElement(currentElement.id, {
                  width: currentElement.width === "fill" ? "auto" : "fill",
                })
              }
            >
              {currentElement.width === "fill" ? "Fill container" : "Auto width"}
            </Button>
          </div>

          <div>
            <label className="text-sm text-gray-500">Vertical Spacing</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                min="0"
                max="24"
                value={currentElement.spacing || 0}
                onChange={(e) =>
                  updateElement(currentElement.id, {
                    spacing: Math.min(24, Math.max(0, Number.parseInt(e.target.value))),
                  })
                }
                className="w-20"
              />
              <span className="text-sm text-gray-500">px</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

