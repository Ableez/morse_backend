// spacing-control.tsx
"use client";

import { Input } from "#/components/ui/input";
import { memo } from "react";

type SpacingControlProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export const SpacingControl = memo(function SpacingControl({
  label,
  value,
  onChange,
}: SpacingControlProps) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <Input
          type="number"
          min="0"
          max="24"
          value={value}
          onChange={(e) => {
            const newValue = Math.min(24, Math.max(0, Number(e.target.value)));
            onChange(newValue);
          }}
          className="w-20"
        />
        <span className="text-sm text-gray-500">px</span>
      </div>
    </div>
  );
});
