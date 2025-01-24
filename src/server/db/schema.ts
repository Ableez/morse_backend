import {
  index,
  foreignKey,
  uuid,
  integer,
  timestamp,
  unique,
  boolean,
  varchar,
  text,
  jsonb,
  pgEnum,
  pgTableCreator,
} from "drizzle-orm/pg-core";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";

const createTable = pgTableCreator((name) => `morse_${name}`);

export const accountType = pgEnum("account_type", ["public", "private"]);
export const achievementType = pgEnum("achievement_type", [
  "course_completion",
  "path_completion",
  "streak",
  "first_enrollment",
  "speed_learning",
]);
export const mediaType = pgEnum("media_type", ["image", "video"]);
export const postType = pgEnum("post_type", ["text", "carousel"]);
export const postVisibility = pgEnum("post_visibility", [
  "public",
  "followers",
  "close_friends",
]);
export const lessonStatus = pgEnum("lesson_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const userProgress = createTable(
  "user_progress",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    totalPoints: integer("total_points").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    lastActivityAt: timestamp("last_activity_at", {
      mode: "string",
    }).defaultNow(),
    rank: integer("rank"),
    weeklyPoints: integer("weekly_points").default(0).notNull(),
    monthlyPoints: integer("monthly_points").default(0).notNull(),
  },
  (table) => {
    return {
      userProgressMonthlyIdx: index("user_progress_monthly_idx").using(
        "btree",
        table.monthlyPoints.asc().nullsLast(),
      ),
      userProgressPointsIdx: index("user_progress_points_idx").using(
        "btree",
        table.totalPoints.asc().nullsLast(),
      ),
      userProgressUserIdIdx: index("user_progress_user_id_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      userProgressWeeklyIdx: index("user_progress_weekly_idx").using(
        "btree",
        table.weeklyPoints.asc().nullsLast(),
      ),
      userProgressUserIdMorseUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_progress_user_id_morse_users_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const userLearningProgress = createTable("user_learning_progress", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  lastSyncedAt: timestamp("last_synced_at", { mode: "string" }).defaultNow(),
  localUpdatedAt: timestamp("local_updated_at", {
    mode: "string",
  }).defaultNow(),
  needsSync: boolean("needs_sync").default(false),
  totalPoints: integer("total_points").default(0),
  streak: integer("streak").default(0),
  lastActivityAt: timestamp("last_activity_at", { mode: "string" }),
  metadata: jsonb("metadata"), // Store additional progress metrics
});

// Track progress for each learning path
export const pathProgress = createTable("path_progress", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  pathId: uuid("path_id").notNull(),
  startedAt: timestamp("started_at", { mode: "string" }).defaultNow(),
  completedAt: timestamp("completed_at", { mode: "string" }),
  lastAccessedAt: timestamp("last_accessed_at", { mode: "string" }),
  percentComplete: integer("percent_complete").default(0),
  currentLevelId: uuid("current_level_id"),
  currentCourseId: uuid("current_course_id"),
  needsSync: boolean("needs_sync").default(false),
  localUpdatedAt: timestamp("local_updated_at", {
    mode: "string",
  }).defaultNow(),
  metadata: jsonb("metadata"), // Store path-specific progress data
});

// Track progress for each course
export const courseProgress = createTable("course_progress", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  pathId: uuid("path_id").notNull(),
  startedAt: timestamp("started_at", { mode: "string" }).defaultNow(),
  completedAt: timestamp("completed_at", { mode: "string" }),
  lastAccessedAt: timestamp("last_accessed_at", { mode: "string" }),
  percentComplete: integer("percent_complete").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  needsSync: boolean("needs_sync").default(false),
  localUpdatedAt: timestamp("local_updated_at", {
    mode: "string",
  }).defaultNow(),
  metadata: jsonb("metadata"), // Store course-specific completion criteria
});

// Track progress for each lesson
export const lessonProgress = createTable("lesson_progress", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  lessonId: uuid("lesson_id").notNull(),
  courseId: uuid("course_id").notNull(),
  pathId: uuid("path_id").notNull(),
  status: lessonStatus("status").notNull(),
  startedAt: timestamp("started_at", { mode: "string" }).defaultNow(),
  completedAt: timestamp("completed_at", { mode: "string" }),
  lastAccessedAt: timestamp("last_accessed_at", { mode: "string" }),
  timeSpent: integer("time_spent").default(0), // in seconds
  needsSync: boolean("needs_sync").default(false),
  localUpdatedAt: timestamp("local_updated_at", {
    mode: "string",
  }).defaultNow(),
  metadata: jsonb("metadata"), // Store lesson-specific completion data
});

// Track progress for each swipe card
export const swipeCardProgress = createTable("swipe_card_progress", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  cardId: uuid("card_id").notNull(),
  lessonId: uuid("lesson_id").notNull(),
  courseId: uuid("course_id").notNull(),
  pathId: uuid("path_id").notNull(),
  completed: boolean("completed").default(false),
  viewedAt: timestamp("viewed_at", { mode: "string" }),
  timeSpent: integer("time_spent").default(0), // in seconds
  needsSync: boolean("needs_sync").default(false),
  localUpdatedAt: timestamp("local_updated_at", {
    mode: "string",
  }).defaultNow(),
  metadata: jsonb("metadata"), // Store card-specific interaction data
});

export const levels = createTable(
  "levels",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    pathId: uuid("path_id").notNull(),
    title: varchar("title"),
    description: text("description"),
    imageUrl: text("image_url").default(
      "https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg",
    ),
    number: integer("number").notNull(),
  },
  (table) => {
    return {
      levelNumberIdx: index("level_number_idx").using(
        "btree",
        table.number.asc().nullsLast(),
      ),
      levelPathIdIdx: index("level_path_id_idx").using(
        "btree",
        table.pathId.asc().nullsLast(),
      ),
      levelsPathIdMorseLearningPathsIdFk: foreignKey({
        columns: [table.pathId],
        foreignColumns: [learningPaths.id],
        name: "levels_path_id_morse_learning_paths_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const users = createTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    clerkId: varchar("clerk_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    deletedBy: varchar("deleted_by"),
    username: varchar("username", { length: 255 }),
    displayName: varchar("display_name", { length: 255 }),
    bio: text("bio"),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    profileImageUrl: varchar("profile_image_url", { length: 255 }),
    birthday: timestamp("birthday", { mode: "string" }),
    gender: varchar("gender", { length: 50 }),
    passwordEnabled: boolean("password_enabled").default(true).notNull(),
    twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
    lastSignInAt: timestamp("last_sign_in_at", { mode: "string" }),
    disabled: boolean("disabled").default(false).notNull(),
    metadata: jsonb("metadata"),
  },
  (table) => {
    return {
      activeUsersIdx: index("active_users_idx")
        .using("btree", table.lastSignInAt.asc().nullsLast())
        .where(sql`((disabled = false) AND (deleted = false))`),
      userEmailIdx: index("user_email_idx").using(
        "btree",
        table.email.asc().nullsLast(),
      ),
      userNameSearchIdx: index("user_name_search_idx").using(
        "btree",
        table.displayName.asc().nullsLast(),
      ),
      userUsernameIdx: index("user_username_idx").using(
        "btree",
        table.username.asc().nullsLast(),
      ),
      usersUsernameUnique: unique("users_username_unique").on(table.username),
      usersEmailUnique: unique("users_email_unique").on(table.email),
    };
  },
);

export const courses = createTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    levelId: uuid("level_id").notNull(),
    pathId: uuid("path_id").notNull(),
    title: varchar("title").notNull(),
    slug: varchar("slug").notNull(),
    imageUrl: varchar("image_url"),
    percentComplete: integer("percent_complete").default(0),
    isUpdated: boolean("is_updated").default(false),
    desktopOnly: boolean("desktop_only").default(false),
    retiringOn: timestamp("retiring_on", { mode: "string" }),
  },
  (table) => {
    return {
      courseLevelIdIdx: index("course_level_id_idx").using(
        "btree",
        table.levelId.asc().nullsLast(),
      ),
      courseSlugIdx: index("course_slug_idx").using(
        "btree",
        table.slug.asc().nullsLast(),
      ),
      coursesLevelIdMorseLevelsIdFk: foreignKey({
        columns: [table.levelId],
        foreignColumns: [levels.id],
        name: "courses_level_id_morse_levels_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const swipeCards = createTable(
  "swipe_cards",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    title: text("title").notNull(),
    content: varchar("content"),
    pathId: uuid("path_id").notNull(),
    courseId: uuid("course_id").notNull(),
    levelId: uuid("level_id").notNull(),
    lessonId: uuid("lesson_id"),
  },
  (table) => {
    return {
      swipeCardCourseIdx: index("swipe_card_course_idx").using(
        "btree",
        table.courseId.asc().nullsLast(),
      ),
      swipeCardLessonIdx: index("swipe_card_lesson_idx").using(
        "btree",
        table.lessonId.asc().nullsLast(),
      ),
      swipeCardLevelIdx: index("swipe_card_level_idx").using(
        "btree",
        table.levelId.asc().nullsLast(),
      ),
      swipeCardPathIdx: index("swipe_card_path_idx").using(
        "btree",
        table.pathId.asc().nullsLast(),
      ),
      swipeCardsPathIdMorseLearningPathsIdFk: foreignKey({
        columns: [table.pathId],
        foreignColumns: [learningPaths.id],
        name: "swipe_cards_path_id_morse_learning_paths_id_fk",
      }).onDelete("cascade"),
      swipeCardsCourseIdMorseCoursesIdFk: foreignKey({
        columns: [table.courseId],
        foreignColumns: [courses.id],
        name: "swipe_cards_course_id_morse_courses_id_fk",
      }).onDelete("cascade"),
      swipeCardsLevelIdMorseLevelsIdFk: foreignKey({
        columns: [table.levelId],
        foreignColumns: [levels.id],
        name: "swipe_cards_level_id_morse_levels_id_fk",
      }).onDelete("cascade"),
      swipeCardsLessonIdMorseLessonsIdFk: foreignKey({
        columns: [table.lessonId],
        foreignColumns: [lessons.id],
        name: "swipe_cards_lesson_id_morse_lessons_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const userAchievements = createTable(
  "user_achievements",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    achievementId: uuid("achievement_id").notNull(),
    earnedAt: timestamp("earned_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => {
    return {
      userAchievementsAchievementIdx: index(
        "user_achievements_achievement_idx",
      ).using("btree", table.achievementId.asc().nullsLast()),
      userAchievementsUserIdx: index("user_achievements_user_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      userAchievementsUserIdMorseUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_achievements_user_id_morse_users_id_fk",
      }).onDelete("cascade"),
      userAchievementsAchievementIdMorseAchievementsIdFk: foreignKey({
        columns: [table.achievementId],
        foreignColumns: [achievements.id],
        name: "user_achievements_achievement_id_morse_achievements_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const lessons = createTable(
  "lessons",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    courseId: uuid("course_id").notNull(),
    pathId: uuid("path_id").notNull(),
    levelId: uuid("level_id").notNull(),
  },
  (table) => {
    return {
      lessonsCourseIdMorseCoursesIdFk: foreignKey({
        columns: [table.courseId],
        foreignColumns: [courses.id],
        name: "lessons_course_id_morse_courses_id_fk",
      }).onDelete("cascade"),
      lessonsPathIdMorseLearningPathsIdFk: foreignKey({
        columns: [table.pathId],
        foreignColumns: [learningPaths.id],
        name: "lessons_path_id_morse_learning_paths_id_fk",
      }).onDelete("cascade"),
      lessonsLevelIdMorseLevelsIdFk: foreignKey({
        columns: [table.levelId],
        foreignColumns: [levels.id],
        name: "lessons_level_id_morse_levels_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const colorSchemes = createTable("color_schemes", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  colorName: varchar("color_name").notNull(),
  defaultColor: varchar("default_color"),
  s100: varchar("s100"),
  s200: varchar("s200"),
  s300: varchar("s300"),
  s400: varchar("s400"),
  s500: varchar("s500"),
  s600: varchar("s600"),
  s700: varchar("s700"),
  s800: varchar("s800"),
  s900: varchar("s900"),
});

export const learningPaths = createTable(
  "learning_paths",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    slug: varchar("slug").notNull(),
    title: varchar("title").notNull(),
    description: text("description"),
    imageUrl: varchar("image_url"),
    isEnrolled: boolean("is_enrolled").default(false),
    percentComplete: integer("percent_complete").default(0),
    wasRecommended: boolean("was_recommended").default(false),
    suggestedCourseSlug: varchar("suggested_course_slug"),
    colorSchemeId: uuid("color_scheme_id"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      learningPathSlugIdx: index("learning_path_slug_idx").using(
        "btree",
        table.slug.asc().nullsLast(),
      ),
      learningPathsSlugUnique: unique("learning_paths_slug_unique").on(
        table.slug,
      ),
    };
  },
);

export const leaderboard = createTable(
  "leaderboard",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    pathId: uuid("path_id"),
    points: integer("points").default(0).notNull(),
    rank: integer("rank").notNull(),
    period: varchar("period", { length: 20 }).notNull(),
    achievementCount: integer("achievement_count").default(0).notNull(),
    lastUpdated: timestamp("last_updated", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      leaderboardPathIdx: index("leaderboard_path_idx").using(
        "btree",
        table.pathId.asc().nullsLast(),
      ),
      leaderboardPeriodIdx: index("leaderboard_period_idx").using(
        "btree",
        table.period.asc().nullsLast(),
      ),
      leaderboardPointsIdx: index("leaderboard_points_idx").using(
        "btree",
        table.points.asc().nullsLast(),
      ),
      leaderboardRankIdx: index("leaderboard_rank_idx").using(
        "btree",
        table.rank.asc().nullsLast(),
      ),
      leaderboardUserIdx: index("leaderboard_user_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      leaderboardUserIdMorseUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "leaderboard_user_id_morse_users_id_fk",
      }).onDelete("cascade"),
      leaderboardPathIdMorseLearningPathsIdFk: foreignKey({
        columns: [table.pathId],
        foreignColumns: [learningPaths.id],
        name: "leaderboard_path_id_morse_learning_paths_id_fk",
      }).onDelete("cascade"),
    };
  },
);

export const achievements = createTable(
  "achievements",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    type: achievementType("type").notNull(),
    name: varchar("name").notNull(),
    description: text("description"),
    pointValue: integer("point_value").default(0).notNull(),
    imageUrl: varchar("image_url"),
  },
  (table) => {
    return {
      achievementTypeIdx: index("achievement_type_idx").using(
        "btree",
        table.type.asc().nullsLast(),
      ),
    };
  },
);

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  userProgresses: many(userProgress),
  userAchievements: many(userAchievements),
  leaderboards: many(leaderboard),
}));

export const levelsRelations = relations(levels, ({ one, many }) => ({
  learningPath: one(learningPaths, {
    fields: [levels.pathId],
    references: [learningPaths.id],
  }),
  courses: many(courses),
  swipeCards: many(swipeCards),
  lessons: many(lessons),
}));

export const learningPathsRelations = relations(
  learningPaths,
  ({ one, many }) => ({
    levels: many(levels),
    swipeCards: many(swipeCards),
    lessons: many(lessons),
    leaderboards: many(leaderboard),
    colorScheme: one(colorSchemes, {
      fields: [learningPaths.colorSchemeId],
      references: [colorSchemes.id],
    }),
  }),
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  level: one(levels, {
    fields: [courses.levelId],
    references: [levels.id],
  }),
  swipeCards: many(swipeCards),
  lessons: many(lessons),
  learningPath: one(learningPaths, {
    fields: [courses.pathId],
    references: [learningPaths.id],
  }),
}));

export const swipeCardsRelations = relations(swipeCards, ({ one }) => ({
  learningPath: one(learningPaths, {
    fields: [swipeCards.pathId],
    references: [learningPaths.id],
  }),
  course: one(courses, {
    fields: [swipeCards.courseId],
    references: [courses.id],
  }),
  level: one(levels, {
    fields: [swipeCards.levelId],
    references: [levels.id],
  }),
  lesson: one(lessons, {
    fields: [swipeCards.lessonId],
    references: [lessons.id],
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  swipeCards: many(swipeCards),
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  learningPath: one(learningPaths, {
    fields: [lessons.pathId],
    references: [learningPaths.id],
  }),
  level: one(levels, {
    fields: [lessons.levelId],
    references: [levels.id],
  }),
}));

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    user: one(users, {
      fields: [userAchievements.userId],
      references: [users.id],
    }),
    achievement: one(achievements, {
      fields: [userAchievements.achievementId],
      references: [achievements.id],
    }),
  }),
);

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const colorSchemesRelations = relations(colorSchemes, ({ many }) => ({
  learningPath: many(learningPaths),
}));

export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
  user: one(users, {
    fields: [leaderboard.userId],
    references: [users.id],
  }),
  learningPath: one(learningPaths, {
    fields: [leaderboard.pathId],
    references: [learningPaths.id],
  }),
}));

// TYPE DEFINITIONS

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export type UserProgress = InferSelectModel<typeof userProgress>;
export type UserProgressInsert = InferInsertModel<typeof userProgress>;

export type Level = InferSelectModel<typeof levels>;
export type LevelInsert = InferInsertModel<typeof levels>;

export type Course = InferSelectModel<typeof courses>;
export type CourseInsert = InferInsertModel<typeof courses>;

export type SwipeCard = InferSelectModel<typeof swipeCards>;
export type SwipeCardInsert = InferInsertModel<typeof swipeCards>;

export type UserAchievement = InferSelectModel<typeof userAchievements>;
export type UserAchievementInsert = InferInsertModel<typeof userAchievements>;

export type Lesson = InferSelectModel<typeof lessons>;
export type LessonInsert = InferInsertModel<typeof lessons>;

export type LearningPath = InferSelectModel<typeof learningPaths>;
export type LearningPathInsert = InferInsertModel<typeof learningPaths>;

export type ColorScheme = InferSelectModel<typeof colorSchemes>;
export type ColorSchemeInsert = InferInsertModel<typeof colorSchemes>;

export type Leaderboard = InferSelectModel<typeof leaderboard>;
export type LeaderboardInsert = InferInsertModel<typeof leaderboard>;

export type Achievement = InferSelectModel<typeof achievements>;
export type AchievementInsert = InferInsertModel<typeof achievements>;

// Types with Relations
export interface UserWithRelations extends User {
  userProgresses?: UserProgress[];
  userAchievements?: UserAchievement[];
  leaderboards?: Leaderboard[];
}

export interface UserProgressWithRelations extends UserProgress {
  user?: User;
}

export interface LevelWithRelations extends Level {
  learningPath?: LearningPath;
  courses?: Course[];
  swipeCards?: SwipeCard[];
  lessons?: Lesson[];
}

export interface LearningPathWithRelations extends LearningPath {
  levels?: Level[];
  swipeCards?: SwipeCard[];
  lessons?: Lesson[];
  colorSchemes?: ColorScheme[];
  leaderboards?: Leaderboard[];
}

export interface LearningPathAllRelations extends LearningPath {
  levels?: LevelWithRelations[];
  swipeCards?: SwipeCardWithRelations[];
  lessons?: LessonWithRelations[];
  colorScheme?: ColorScheme;
  leaderboards?: LeaderboardWithRelations[];
}

export interface CourseWithRelations extends Course {
  level?: Level;
  swipeCards?: SwipeCard[];
  lessons?: Lesson[];
}

export interface SwipeCardWithRelations extends SwipeCard {
  learningPath?: LearningPath;
  course?: Course;
  level?: Level;
  lesson?: Lesson;
}

export interface LessonWithRelations extends Lesson {
  swipeCards?: SwipeCard[];
  course?: Course;
  learningPath?: LearningPath;
  level?: Level;
}

export interface UserAchievementWithRelations extends UserAchievement {
  user?: User;
  achievement?: Achievement;
}

export interface AchievementWithRelations extends Achievement {
  userAchievements?: UserAchievement[];
}

export interface ColorSchemeWithRelations extends ColorScheme {
  learningPath?: LearningPath;
}

export interface LeaderboardWithRelations extends Leaderboard {
  user?: User;
  learningPath?: LearningPath;
}
