DO $$ BEGIN
 CREATE TYPE "public"."lesson_status" AS ENUM('not_started', 'in_progress', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_course_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"percent_complete" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"needs_sync" boolean DEFAULT false,
	"local_updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_lesson_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"status" "lesson_status" NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"time_spent" integer DEFAULT 0,
	"needs_sync" boolean DEFAULT false,
	"local_updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_path_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"percent_complete" integer DEFAULT 0,
	"current_level_id" uuid,
	"current_course_id" uuid,
	"needs_sync" boolean DEFAULT false,
	"local_updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_swipe_card_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"completed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"time_spent" integer DEFAULT 0,
	"needs_sync" boolean DEFAULT false,
	"local_updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_user_learning_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"last_synced_at" timestamp DEFAULT now(),
	"local_updated_at" timestamp DEFAULT now(),
	"needs_sync" boolean DEFAULT false,
	"total_points" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"last_activity_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "morse_levels" ADD COLUMN "title" varchar;--> statement-breakpoint
ALTER TABLE "morse_levels" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "morse_levels" ADD COLUMN "image_url" text DEFAULT 'https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg';