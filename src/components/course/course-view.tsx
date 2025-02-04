"use client";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { CourseWithRelations } from "#/server/db/schema";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  MonitorSmartphone,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

export default function CourseView({
  course,
}: {
  course: CourseWithRelations;
}) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto p-6">
          <Link
            href={`/learning-paths/${course.pathId}`}
            className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learning Path
          </Link>

          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative flex h-48 w-full place-items-center justify-center overflow-hidden rounded-xl border align-middle md:w-72">
              <Image
                src={course.imageUrl ?? "/placeholder.svg"}
                alt={course.title}
                width={120}
                height={120}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {course.isUpdated && (
                    <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                      NEW
                    </Badge>
                  )}
                  {course.desktopOnly && (
                    <Badge variant="outline" className="gap-1">
                      <MonitorSmartphone className="h-3 w-3" />
                      Desktop Only
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  className="gap-2"
                  onClick={() => {
                    router.push(
                      "/canvas/new" +
                        "?" +
                        createQueryString(
                          "pathId",
                          `${course.pathId + "__Path"}`,
                        ) +
                        "&" +
                        createQueryString(
                          "levelId",
                          `${course.levelId + "__" + (course.level?.title ?? "__Level")}`,
                        ) +
                        "&" +
                        createQueryString(
                          "courseId",
                          `${course.id + "__" + course.title}`,
                        ),
                    );
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add a Lesson
                </Button>
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Overview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {course.lessons?.map((lesson) => (
            <Card
              key={lesson.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedLesson === lesson.id ? "ring-primary ring-2" : ""
              }`}
              onClick={() => setSelectedLesson(lesson.id)}
            >
              <CardHeader className="relative p-0">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={lesson.imageUrl || "/placeholder.svg"}
                    alt={lesson.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white">
                      {lesson.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {lesson.description}
                </p>
                <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Not started</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {course.lessons?.length === 0 && (
          <Card className="p-6 text-center">
            <CardTitle className="text-muted-foreground">
              No lessons available yet
            </CardTitle>
          </Card>
        )}
      </div>
    </div>
  );
}
