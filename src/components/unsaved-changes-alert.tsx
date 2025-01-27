"use client"

import { useEffect } from "react"
import { useEditor } from "./cards-canvas/editor-context"

export function UnsavedChangesAlert() {
  const { hasUnsavedChanges } = useEditor()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  return null
}

