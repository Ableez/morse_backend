import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  learningPaths,
  courses,
  lessons,
  userProgress,
  userAchievements,
  leaderboard,
  swipeCards,
  levels,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

// Zod schemas for content validation
const TextStyleSchema = z.object({
  variant: z.enum(["body", "title", "caption"]),
  size: z.enum(["small", "medium", "large"]),
  isBold: z.boolean().optional(),
});

const ImageStyleSchema = z.object({
  size: z.enum(["small", "medium", "large"]),
  rounded: z.boolean().optional(),
});

const BaseContentSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const TextContentSchema = BaseContentSchema.extend({
  _type: z.literal("text"),
  content: z.string(),
  style: TextStyleSchema,
});

const ImageContentSchema = BaseContentSchema.extend({
  _type: z.literal("image"),
  url: z.string().url(),
  alt: z.string().optional(),
  format: z.enum(["png", "gif"]),
  style: ImageStyleSchema,
});

const ContentSchema = z.discriminatedUnion("_type", [
  TextContentSchema,
  ImageContentSchema,
]);

export const learningRouter = createTRPCRouter({
  // Learning Paths

  // Courses
  getCourseById: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { courseId: paramId } = input;
      try {
        const course = await ctx.db.query.courses.findFirst({
          where: eq(courses.id, paramId),
          with: {
            lessons: true,
            learningPath: true,
          },
        });

        if (!course) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return course;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // Lessons
  getLessonById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const lesson = await ctx.db.query.lessons.findFirst({
          where: eq(lessons.id, input),
          with: {
            course: true,
            learningPath: true,
            level: true,
            swipeCards: true,
          },
        });

        if (!lesson) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return lesson;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // User Progress & Achievements
  getUserProgress: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const progress = await ctx.db.query.userProgress.findFirst({
        where: eq(userProgress.userId, ctx.userId),
        with: {
          user: true,
        },
      });

      const achievements = await ctx.db.query.userAchievements.findMany({
        where: eq(userAchievements.userId, ctx.userId),
        with: {
          achievement: true,
        },
      });

      return {
        progress,
        achievements,
      };
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  // Leaderboard
  getLeaderboard: publicProcedure
    .input(
      z.object({
        pathId: z.string().uuid().optional(),
        period: z.enum(["weekly", "monthly", "all_time"]),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const whereClause = input.pathId
          ? and(
              eq(leaderboard.pathId, input.pathId),
              eq(leaderboard.period, input.period),
            )
          : eq(leaderboard.period, input.period);

        const rankings = await ctx.db.query.leaderboard.findMany({
          where: whereClause,
          with: {
            user: true,
            learningPath: true,
          },
          orderBy: (entries, { desc }) => [desc(entries.points)],
          limit: input.limit,
        });

        return rankings;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // SwipeCard Methods
  getSwipeCardById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const card = await ctx.db.query.swipeCards.findFirst({
          where: eq(swipeCards.id, input),
          with: {
            lesson: true,
            course: true,
            learningPath: true,
            level: true,
          },
        });

        if (!card) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        // Parse the content from JSON to our typed content
        const content = JSON.parse(card.content ?? "null") as unknown;
        if (!content) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid card content",
          });
        }

        return {
          ...card,
          content: ContentSchema.parse(content), // Validate the content matches our types
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getSwipeCardsByLessonId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const cards = await ctx.db.query.swipeCards.findMany({
          where: eq(swipeCards.lessonId, input),
          with: {
            lesson: true,
          },
        });

        return cards.map((card) => ({
          ...card,
          content: ContentSchema.parse(JSON.parse(card.content ?? "null")),
        }));
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  createSwipeCard: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: ContentSchema,
        lessonId: z.string().uuid(),
        pathId: z.string().uuid(),
        courseId: z.string().uuid(),
        levelId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { title, content, lessonId, pathId, courseId, levelId } = input;

        const newCard = await ctx.db
          .insert(swipeCards)
          .values({
            title,
            content: JSON.stringify(content),
            lessonId,
            pathId,
            courseId,
            levelId,
          })
          .returning();

        return newCard[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  updateSwipeCard: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        content: ContentSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        const updatedCard = await ctx.db
          .update(swipeCards)
          .set({ content: JSON.stringify(updateData) })
          .where(eq(swipeCards.id, id))
          .returning();

        if (!updatedCard.length) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return updatedCard[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  deleteSwipeCard: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.delete(swipeCards).where(eq(swipeCards.id, input));

        return { success: true };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getAllPaths: publicProcedure.query(async ({ ctx }) => {
    try {
      const paths = await ctx.db.query.learningPaths.findMany({
        with: {
          colorScheme: true,
          levels: {
            with: {
              courses: {
                with: {
                  lessons: {
                    with: {
                      swipeCards: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: (paths, { desc }) => [desc(paths.createdAt)],
      });
      return paths;
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  getPathById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const path = await ctx.db.query.learningPaths.findFirst({
          where: eq(learningPaths.id, input),
          with: {
            colorScheme: true,
            levels: {
              with: {
                courses: true,
              },
            },
            leaderboards: {
              where: eq(leaderboard.period, "all_time"),
              with: {
                user: true,
              },
              orderBy: (entries, { desc }) => [desc(entries.points)],
              limit: 10,
            },
          },
        });

        if (!path) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return path;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  createCourse: publicProcedure
    .input(
      z.object({
        title: z.string().min(3).max(100),
        slug: z.string().min(3).max(50),
        description: z.string().max(500).optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
        levelId: z.string().uuid(),
        pathId: z.string().uuid(),
        desktopOnly: z.boolean().optional(),
        retiringOn: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newCourse = await ctx.db
          .insert(courses)
          .values({
            ...input,
            retiringOn: input.retiringOn,
            description: input.description ?? "",
          })
          .returning();
        return newCourse[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  updateCourse: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        desktopOnly: z.boolean().optional(),
        retiringOn: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        const updatedCourse = await ctx.db
          .update(courses)
          .set(updateData)
          .where(eq(courses.id, id))
          .returning();
        if (!updatedCourse.length) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return updatedCourse[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  createLevel: publicProcedure
    .input(
      z.object({
        title: z.string().min(2).max(50),
        description: z.string().max(500).optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
        index: z.coerce.number(),
        pathId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newLevel = await ctx.db
          .insert(levels)
          .values({ ...input, number: input.index })
          .returning();

        return newLevel[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getSimplePathById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const path = await ctx.db.query.learningPaths.findFirst({
          where: eq(learningPaths.id, input),
          with: {
            colorScheme: true,
            levels: true,
          },
        });

        if (!path) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return path;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getLevelById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.levels.findFirst({
        where: eq(levels.id, input),
      });
    }),

  createLearningPath: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(3).max(50),
        title: z.string().min(3).max(100),
        description: z.string().max(500).optional(),
        imageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newPath = await ctx.db
          .insert(learningPaths)
          .values(input)
          .returning();
        return newPath[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getColorSchemes: publicProcedure.query(async ({ ctx }) => {
    try {
      const colorSchemes = await ctx.db.query.colorSchemes.findMany();

      return colorSchemes;
    } catch (error) {
      console.error("ERROR SHITT AGAIN!", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  updateLearningPath: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        colorSchemeId: z.string().uuid().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        const updatedPath = await ctx.db
          .update(learningPaths)
          .set(updateData)
          .where(eq(learningPaths.id, id))
          .returning();
        if (!updatedPath.length) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return updatedPath[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  deleteLearningPath: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.delete(learningPaths).where(eq(learningPaths.id, input));
        return { success: true };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
