"use client";

import Image from "next/image";
import type { Content } from "@/types/content";
import { isTextContent, isImageContent } from "@/types/content";
import { Button } from "@/components/ui/button";
import { DeleteIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

function SwipeCard({
  editContent,
  removeContent,
  cardContent,
  editTitle,
}: Readonly<{
  editContent: (id: string, newUpdates: Partial<Content>) => void;
  removeContent: (id: string) => void;
  cardContent: {
    title?: string;
    content: Content[];
  };
  editTitle: (newTitle: string) => void;
}>) {
  const renderContent = (item: Content) => {
    if (isImageContent(item)) {
      return (
        <div className="relative my-4 flex w-full flex-col justify-center align-middle">
          <Image
            src={item.imageUrl}
            alt={item.alt ?? ""}
            width={item.imageWidth ?? 200}
            height={item.imageWidth ?? 200}
            className="mx-auto rounded-2xl"
          />
          {item.caption && (
            <p
              contentEditable
              onBlur={(e) =>
                editContent(item.id, {
                  caption: e.currentTarget.textContent ?? "",
                })
              }
              className="mt-2 text-center text-xs italic text-gray-600 focus:outline-none"
            >
              {item.caption}
            </p>
          )}
        </div>
      );
    }

    if (isTextContent(item)) {
      const className = `mb-1 focus:outline-none ${
        item.textStyle === "title"
          ? "text-xl font-bold"
          : item.textStyle === "caption"
            ? "text-xs italic text-gray-600"
            : "text-sm justify-full"
      }`;

      return (
        <div
          contentEditable
          className={cn("w-full cursor-text text-black", className)}
          onBlur={(e) =>
            editContent(item.id, {
              textContent: e.currentTarget.textContent ?? "",
            })
          }
          dangerouslySetInnerHTML={{ __html: item.textContent }}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="h-[50dvh] w-[300px] overflow-hidden rounded-3xl border border-black bg-white p-6 shadow-lg"
      style={{ minHeight: "440px" }}
    >
      <div className="flex w-full items-center justify-center">
        <input
          value={cardContent.title}
          onChange={(e) => editTitle(e.target.value)}
          className="mb-1 w-fit border-b-2 border-black/10 bg-transparent pb-0.5 text-center text-lg font-bold text-black focus:outline-none"
        />
      </div>
      {cardContent.content.map((item) => (
        <div
          key={item.id}
          className="group relative flex items-center align-middle"
        >
          {renderContent(item)}
          <button
            onClick={() => removeContent(item.id)}
            className="absolute -right-1 top-2 rounded-lg opacity-0 transition-all duration-300 ease-out group-hover:right-1 group-hover:opacity-100"
          >
            <Trash2Icon size={16} color="#eb0000" />
          </button>
        </div>
      ))}
      {cardContent.content.length === 0 && (
        <div className="flex h-full items-center justify-center text-gray-400">
          <h4 className="mb-4">Add contents</h4>
        </div>
      )}
    </div>
  );
}

export default function Canvas({
  editContent,
  handleAdd,
  removeContent,
  cardContent,
  handleSave,
  editTitle,
}: Readonly<{
  editContent: (id: string, newUpdates: Partial<Content>) => void;
  handleAdd: (content: Content) => void;
  removeContent: (id: string) => void;
  cardContent: {
    title?: string;
    content: Content[];
  };
  handleSave: () => void;
  editTitle: (newTitle: string) => void;
}>) {
  return (
    <div className="canvas_a flex h-screen w-screen flex-col items-center justify-center">
      <SwipeCard
        editContent={editContent}
        removeContent={removeContent}
        cardContent={cardContent}
        editTitle={editTitle}
      />
      <div className="absolute bottom-10 flex place-items-center justify-between gap-4 rounded-2xl bg-neutral-800 p-1.5 align-middle">
        <Button
          variant="destructive"
          onClick={() =>
            handleAdd({
              id: crypto.randomUUID(),
              _type: "text",
              textContent: "",
              textStyle: "body",
              textSize: "normal",
            })
          }
          size={"icon"}
        >
          <DeleteIcon />
        </Button>
        <Button
          onClick={() => {
            handleSave();
          }}
          size={"icon"}
          variant="outline"
        >
          <SaveIcon />
        </Button>
      </div>
    </div>
  );
}
