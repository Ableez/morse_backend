ALTER TABLE "morse_swipe_cards" DROP CONSTRAINT "swipe_cards_lesson_id_morse_lessons_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "swipe_card_lesson_idx";--> statement-breakpoint
ALTER TABLE "morse_swipe_cards" DROP COLUMN IF EXISTS "lesson_id";