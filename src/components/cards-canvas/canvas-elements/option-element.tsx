"use client";

import type { ContentElement } from "@/types/swipe-data";

type OptionsElementProps = {
  element: ContentElement & { choices: string[] };
};

export function OptionsElement({ element }: OptionsElementProps) {
  return (
    <ul className="space-y-2">
      {element.choices?.map((choice, i) => (
        <li key={i} className="flex items-center gap-2">
          <input
            type="radio"
            name={`choices-${element.id}`}
            id={`choice-${element.id}-${i}`}
          />
          <label htmlFor={`choice-${element.id}-${i}`}>{choice}</label>
        </li>
      ))}
    </ul>
  );
}
