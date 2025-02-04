import { useState, useCallback, useEffect } from "react";
import type { CardContent, Content } from "#/types/content";
import { storage } from "#/lib/storage";
import { api } from "#/trpc/react";
import type { LearningPathWithRelations } from "#/server/db/schema";

const DEFAULT_CARD: CardContent = {
  id: crypto.randomUUID(),
  content: [],
};

export const useCards = () => {
  const [allCards, setAllCards] = useState<CardContent[]>(() =>
    storage.getItem<CardContent[]>("cards", []),
  );
  const [currentCard, setCurrentCard] = useState<CardContent>(() =>
    storage.getItem<CardContent>("currentCard", DEFAULT_CARD),
  );
  const [learningPaths, setLearningPaths] =
    useState<LearningPathWithRelations[]>();

  const { data: allLearningPaths, isLoading: isLoadingPaths } =
    api.learning.getAllPaths.useQuery();

  useEffect(() => {
    storage.setItem("cards", allCards);
  }, [allCards]);

  useEffect(() => {
    storage.setItem("currentCard", currentCard);
  }, [currentCard]);

  useEffect(() => {
    if (!isLoadingPaths) setLearningPaths(allLearningPaths);
  }, [allLearningPaths, isLoadingPaths]);

  const addContent = useCallback((content: Content) => {
    setCurrentCard((prev) => ({
      ...prev,
      content: [...prev.content, content],
    }));
  }, []);

  const removeContent = useCallback((id: string) => {
    setCurrentCard((prev) => ({
      ...prev,
      content: prev.content.filter((c) => c.id !== id),
    }));
  }, []);

  const editContent = useCallback((id: string, updates: Partial<Content>) => {
    setCurrentCard((prev) => ({
      ...prev,
      content: prev.content.map((c) =>
        c.id === id ? ({ ...c, ...updates } as Content) : c,
      ),
    }));
  }, []);

  const editTitle = useCallback((newTitle: string) => {
    setCurrentCard((prev) => ({ ...prev, title: newTitle }));
  }, []);

  const saveCard = useCallback(() => {
    setAllCards((prev) => {
      const index = prev.findIndex((card) => card.id === currentCard.id);
      if (index !== -1) {
        const updatedCards = [...prev];
        updatedCards[index] = currentCard;
        return updatedCards;
      }
      return [...prev, currentCard];
    });
    setCurrentCard(DEFAULT_CARD);
  }, [currentCard]);

  return {
    allCards,
    currentCard,
    setCurrentCard,
    addContent,
    removeContent,
    editContent,
    editTitle,
    saveCard,
    learningPaths,
  };
};
