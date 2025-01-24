ALTER TABLE "morse_swipe_cards" ADD COLUMN "lesson_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_swipe_cards" ADD CONSTRAINT "swipe_cards_lesson_id_morse_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."morse_lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "swipe_card_lesson_idx" ON "morse_swipe_cards" USING btree ("lesson_id");