"use client";

import type { OptionsElement } from "#/types/swipe-data";

type OptionsElementProps = {
  element: OptionsElement;
};

export function OptionsElement({ element }: OptionsElementProps) {
  return (
    <ul className="grid grid-cols-2 gap-4">
      {element.choices?.map((choice, i) => (
        <button
          className={`w-full rounded-2xl border-2 px-4 py-3 duration-300 ease-in-out hover:border-blue-600/30`}
          key={`choice-${element.id}-${i}`}
        >
          {choice}
        </button>
      ))}
    </ul>
  );
}
