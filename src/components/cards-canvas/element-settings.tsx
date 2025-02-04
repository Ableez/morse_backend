"use client";

import { useEditor } from "./editor-context";
import { memo } from "react";
import type { ContentElement } from "#/types/swipe-data";
import { TextElementSettings } from "./text-element-settings";
import { ElementWidthControl } from "./element-width-control";
import { SpacingControl } from "./spacing-control";

type ElementSettingsProps = {
  element: ContentElement;
};

export const ElementSettings = memo(function ElementSettings({
  element,
}: ElementSettingsProps) {
  const { updateElement } = useEditor();

  return (
    <div className="space-y-4">
      {element.type === "text" && <TextElementSettings element={element} />}

      <ElementWidthControl element={element} />
      <SpacingControl
        label="Top Space"
        value={element.topSpace ?? 0}
        onChange={(value) => updateElement(element.id, { topSpace: value })}
      />
      <SpacingControl
        label="Bottom Space"
        value={element.bottomSpace ?? 0}
        onChange={(value) => updateElement(element.id, { bottomSpace: value })}
      />
    </div>
  );
});
