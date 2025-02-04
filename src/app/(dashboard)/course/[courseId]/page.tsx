import CourseView from "#/components/course/course-view";
import { api } from "#/trpc/server";
import React from "react";

type Props = {
  params: Promise<{ courseId: string }>;
};

const CoursePage = async ({ params }: Props) => {
  const { courseId } = await params;
  const course = await api.learning.getCourseById({ courseId });

  if (!course) {
    return <div>Course not found</div>;
  }

  return <CourseView course={course} />;
};

export default CoursePage;
