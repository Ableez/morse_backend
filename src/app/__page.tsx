"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, TextIcon as LetterTextIcon, ImageIcon } from "lucide-react";
import Canvas from "@/components/canvas";
import {
  type Content,
  type TextContent,
  type ImageContent,
  isTextContent,
  isImageContent,
} from "@/types/content";
import { useCards } from "@/hooks/use-cards";
import CardManager from "@/components/card-manager";

// Props Types
interface TemplateItemProps {
  item: Content;
  onAdd: (content: Content) => void;
}

// Constants
const TEXT_TEMPLATES: ReadonlyArray<TextContent> = [
  {
    id: crypto.randomUUID(),
    _type: "text",
    textStyle: "body",
    textSize: "normal",
    textContent: "Body",
  },
  {
    id: crypto.randomUUID(),
    _type: "text",
    textStyle: "caption",
    textSize: "small",
    textContent: "Caption",
  },
  {
    id: crypto.randomUUID(),
    _type: "text",
    textStyle: "title",
    textSize: "large",
    textContent: "Title",
  },
] as const;

const IMAGE_TEMPLATES: ReadonlyArray<ImageContent> = [
  {
    id: crypto.randomUUID(),
    _type: "image",
    imageUrl: "/3d_empty.png",
    caption: "Small",
    imageWidth: 100,
  },
  {
    id: crypto.randomUUID(),
    _type: "image",
    imageUrl: "/3d_empty.png",
    caption: "Medium",
    imageWidth: 200,
  },
  {
    id: crypto.randomUUID(),
    _type: "image",
    imageUrl: "/3d_empty.png",
    caption: "Large",
    imageWidth: 300,
  },
] as const;

// Template Item Component
const TemplateItem: React.FC<TemplateItemProps> = ({ item, onAdd }) => (
  <div className="w-full">
    <div className="rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-4">
      <div className="flex w-full flex-col justify-center gap-2">
        <div className="flex items-center justify-between gap-4 align-middle">
          <div className="relative flex w-full items-center justify-start gap-4 align-middle">
            {isTextContent(item) ? (
              <LetterTextIcon size={18} className="opacity-50" />
            ) : (
              <ImageIcon size={18} className="opacity-50" />
            )}
            <h4 className="text-center text-sm font-medium">
              {isTextContent(item) ? item.textContent : item.caption}
            </h4>
            <Button
              onClick={() => onAdd(item)}
              size="icon"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 scale-90"
            >
              <PlusIcon size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function Home(): JSX.Element {
  const {
    allCards,
    currentCard,
    addContent,
    removeContent,
    editContent,
    editTitle,
    saveCard,
    setCurrentCard,
    learningPaths,
  } = useCards();

  console.log("LEARNING PATHS", learningPaths);

  const handleAdd = useCallback(
    (content: Content): void => {
      if (currentCard.content.length >= 5) {
        alert("Maximum of 5 content items allowed per card.");
        return;
      }

      if (isImageContent(content)) {
        const imageUrl = window.prompt("Insert image URL");
        if (!imageUrl) return;

        const caption = window.prompt("Add caption (optional)") ?? "";

        addContent({
          ...content,
          id: crypto.randomUUID(),
          imageUrl,
          caption,
        });
      } else {
        addContent({
          ...content,
          id: crypto.randomUUID(),
        });
      }
    },
    [currentCard.content.length, addContent],
  );

  return (
    <div className="flex h-screen w-screen flex-col dark:bg-neutral-900">
      <div className="mx-auto flex w-full">
        <CardManager
          allCards={allCards}
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
        />

        <Canvas
          cardContent={currentCard}
          handleAdd={handleAdd}
          removeContent={removeContent}
          editContent={editContent}
          handleSave={saveCard}
          editTitle={editTitle}
        />

        <aside className="absolute right-2 top-1/2 h-[95dvh] w-[300px] -translate-y-1/2 overflow-y-scroll rounded-2xl border border-neutral-700 bg-neutral-800 p-4">
          <div className="grid w-full gap-1">
            {TEXT_TEMPLATES.map((item) => (
              <TemplateItem key={item.id} item={item} onAdd={handleAdd} />
            ))}
          </div>
          <div className="my-4 w-full border-b border-neutral-700" />
          <div className="grid w-full gap-1">
            {IMAGE_TEMPLATES.map((item) => (
              <TemplateItem key={item.id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
