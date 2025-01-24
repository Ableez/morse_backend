import type { CardContentType } from "@/types/swipe-data";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  path: string;
  level: string;
  course: string;
  slides: CardContentType[];
  duration: number;
}
