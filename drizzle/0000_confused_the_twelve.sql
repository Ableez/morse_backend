DO $$ BEGIN
 CREATE TYPE "public"."account_type" AS ENUM('public', 'private');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."achievement_type" AS ENUM('course_completion', 'path_completion', 'streak', 'first_enrollment', 'speed_learning');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."media_type" AS ENUM('image', 'video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."post_type" AS ENUM('text', 'carousel');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."post_visibility" AS ENUM('public', 'followers', 'close_friends');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "achievement_type" NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"point_value" integer DEFAULT 0 NOT NULL,
	"image_url" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_color_schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid NOT NULL,
	"s100" varchar,
	"s200" varchar,
	"s300" varchar,
	"s500" varchar,
	"s700" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"image_url" varchar,
	"percent_complete" integer DEFAULT 0,
	"is_updated" boolean DEFAULT false,
	"desktop_only" boolean DEFAULT false,
	"retiring_on" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_leaderboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path_id" uuid,
	"points" integer DEFAULT 0 NOT NULL,
	"rank" integer NOT NULL,
	"period" varchar(20) NOT NULL,
	"achievement_count" integer DEFAULT 0 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_learning_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"image_url" varchar,
	"is_enrolled" boolean DEFAULT false,
	"percent_complete" integer DEFAULT 0,
	"was_recommended" boolean DEFAULT false,
	"suggested_course_slug" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "learning_paths_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"course_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"level_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid NOT NULL,
	"number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_swipe_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" varchar,
	"path_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"level_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" uuid NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp DEFAULT now(),
	"rank" integer,
	"weekly_points" integer DEFAULT 0 NOT NULL,
	"monthly_points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "morse_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	"username" varchar(255),
	"display_name" varchar(255),
	"bio" text,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image_url" varchar(255),
	"profile_image_url" varchar(255),
	"birthday" timestamp,
	"gender" varchar(50),
	"password_enabled" boolean DEFAULT true NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"last_sign_in_at" timestamp,
	"disabled" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_color_schemes" ADD CONSTRAINT "color_schemes_path_id_morse_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."morse_learning_paths"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_courses" ADD CONSTRAINT "courses_level_id_morse_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."morse_levels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_leaderboard" ADD CONSTRAINT "leaderboard_user_id_morse_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."morse_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_leaderboard" ADD CONSTRAINT "leaderboard_path_id_morse_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."morse_learning_paths"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_lessons" ADD CONSTRAINT "lessons_course_id_morse_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."morse_courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_lessons" ADD CONSTRAINT "lessons_path_id_morse_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."morse_learning_paths"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_lessons" ADD CONSTRAINT "lessons_level_id_morse_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."morse_levels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_levels" ADD CONSTRAINT "levels_path_id_morse_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."morse_learning_paths"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_swipe_cards" ADD CONSTRAINT "swipe_cards_path_id_morse_learning_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."morse_learning_paths"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_swipe_cards" ADD CONSTRAINT "swipe_cards_course_id_morse_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."morse_courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_swipe_cards" ADD CONSTRAINT "swipe_cards_level_id_morse_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."morse_levels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_swipe_cards" ADD CONSTRAINT "swipe_cards_lesson_id_morse_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."morse_lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_user_achievements" ADD CONSTRAINT "user_achievements_user_id_morse_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."morse_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_morse_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."morse_achievements"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "morse_user_progress" ADD CONSTRAINT "user_progress_user_id_morse_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."morse_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "achievement_type_idx" ON "morse_achievements" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_scheme_path_id_idx" ON "morse_color_schemes" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_level_id_idx" ON "morse_courses" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_slug_idx" ON "morse_courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leaderboard_path_idx" ON "morse_leaderboard" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leaderboard_period_idx" ON "morse_leaderboard" USING btree ("period");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leaderboard_points_idx" ON "morse_leaderboard" USING btree ("points");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leaderboard_rank_idx" ON "morse_leaderboard" USING btree ("rank");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leaderboard_user_idx" ON "morse_leaderboard" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "learning_path_slug_idx" ON "morse_learning_paths" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "level_number_idx" ON "morse_levels" USING btree ("number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "level_path_id_idx" ON "morse_levels" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "swipe_card_course_idx" ON "morse_swipe_cards" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "swipe_card_lesson_idx" ON "morse_swipe_cards" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "swipe_card_level_idx" ON "morse_swipe_cards" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "swipe_card_path_idx" ON "morse_swipe_cards" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievements_achievement_idx" ON "morse_user_achievements" USING btree ("achievement_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievements_user_idx" ON "morse_user_achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_progress_monthly_idx" ON "morse_user_progress" USING btree ("monthly_points");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_progress_points_idx" ON "morse_user_progress" USING btree ("total_points");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_progress_user_id_idx" ON "morse_user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_progress_weekly_idx" ON "morse_user_progress" USING btree ("weekly_points");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "active_users_idx" ON "morse_users" USING btree ("last_sign_in_at") WHERE ((disabled = false) AND (deleted = false));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "morse_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_name_search_idx" ON "morse_users" USING btree ("display_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_username_idx" ON "morse_users" USING btree ("username");