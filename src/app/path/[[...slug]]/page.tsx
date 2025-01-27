import ListPaths from "@/components/path/list";
import PathInfo from "@/components/path/path-info";
import LevelInfo from "@/components/level/level-info";
import CourseInfo from "@/components/course/course-info";
import { api } from "@/trpc/server";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const AllPaths = async ({
  params,
}: {
  params: Promise<{ slugs: string[] }>;
}) => {
  const { slugs } = await params;

  if (slugs && slugs.length > 0) {
    const [pathId, levelId, courseId] = slugs;

    if (pathId && !levelId) {
      const path = await api.learning.getPathById(pathId);
      return <PathInfo path={path} />;
    }

    if (levelId && !courseId) {
      const level = await api.learning.getLevelById(levelId);
      if (!level) return "Level not found";
      return <LevelInfo level={level} />;
    }

    if (courseId) {
      const course = await api.learning.getCourseById({ courseId });
      return <CourseInfo course={course} />;
    }
  }

  const learningPaths = await api.learning.getAllPaths();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Learning Paths</h1>
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <ListPaths learningPaths={learningPaths} />
      </Suspense>
    </div>
  );
};

export default AllPaths;
