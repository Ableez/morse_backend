import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CardContent } from "@/types/content";
import { useCards } from "@/hooks/use-cards";
import Image from "next/image";
import type {
  LearningPathAllRelations,
} from "../server/db/schema";
import { ArrowLeft } from "lucide-react";

interface CardManagerProps {
  allCards: CardContent[];
  currentCard: CardContent;
  setCurrentCard: (card: CardContent) => void;
}

const CardManager: React.FC<CardManagerProps> = () => {
  const { learningPaths } = useCards();
  const [currentLearningPath, setCurrentLearningPath] =
    useState<LearningPathAllRelations | null>(null);

  console.log("LEARNING PATHS", learningPaths);

  return (
    <aside className="absolute left-2 top-1/2 h-[95dvh] w-[250px] -translate-y-1/2 overflow-y-auto rounded-2xl border border-neutral-700 bg-neutral-800 p-2">
      {/* <div className="z-2 flex w-full flex-col gap-2">
        <h2 className="mb-4 text-lg font-semibold">Cards</h2>
        <Button
          onClick={() =>
            setCurrentCard({
              id: crypto.randomUUID(),
              title: "New Card",
              content: [],
            })
          }
          className="mb-4"
        >
          Create New Card
        </Button>
        <div className="space-y-2">
          {allCards.map((card) => (
            <div
              key={card.id}
              className={`w-full cursor-pointer rounded-xl p-2 ${
                card.id === currentCard.id
                  ? "bg-neutral-600"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }`}
              onClick={() => setCurrentCard(card)}
            >
              {card.title}
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex flex-col gap-1">
        <div className="mb-4 flex place-items-center justify-start gap-1 border-b p-2 align-middle dark:border-neutral-700">
          {currentLearningPath && (
            <Button
              onClick={() => setCurrentLearningPath(null)}
              variant={"ghost"}
              size={"icon"}
            >
              <ArrowLeft size={16} />
            </Button>
          )}
          <h4 className="mb-2 font-semibold text-green-500">
            {currentLearningPath?.title ?? "Learning Paths"}
          </h4>
        </div>
        {!currentLearningPath
          ? learningPaths?.map((path) => (
              <button
                onClick={() => setCurrentLearningPath(path)}
                className="flex cursor-pointer place-items-center justify-between rounded-xl border border-transparent bg-neutral-800 p-2 align-middle transition-all duration-300 ease-out hover:border-neutral-700/70 hover:bg-neutral-700"
                key={path.id}
              >
                <div className="flex place-items-center justify-start gap-4 align-middle">
                  <Image
                    src={path.imageUrl ?? "/3d_empty.png"}
                    alt={path.title}
                    width={22}
                    height={22}
                  />
                  <h4 className="text-sm font-semibold">{path.title}</h4>
                </div>
                <h4 className="text-xs text-green-500">
                  {path.levels?.length ?? null}
                </h4>
              </button>
            ))
          : currentLearningPath.levels?.map((level) => (
              <button
                key={level.id}
                className="flex cursor-pointer place-items-center justify-start gap-4 rounded-xl border border-transparent bg-neutral-800 p-2 align-middle transition-all duration-300 ease-out hover:border-neutral-700/70 hover:bg-neutral-700"
              >
                <h4 className="text-sm font-semibold">LEVEL {level.number}</h4>
                <h4 className="text-xs text-green-500">
                  {level?.courses?.length ?? null}
                </h4>
              </button>
            ))}
      </div>
    </aside>
  );
};

export default CardManager;
