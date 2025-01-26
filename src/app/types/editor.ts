import type { CardContentType } from "@/types/swipe-data";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  path: string;
  pathId: string;
  level: string;
  levelId: string;
  course: string;
  courseId: string;
  slides: CardContentType[];
  duration: number;
}
