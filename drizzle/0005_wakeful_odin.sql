ALTER TABLE "morse_color_schemes" DROP CONSTRAINT "color_schemes_path_id_morse_learning_paths_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "color_scheme_path_id_idx";--> statement-breakpoint
ALTER TABLE "morse_color_schemes" DROP COLUMN IF EXISTS "path_id";