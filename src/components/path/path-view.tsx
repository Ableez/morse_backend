"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BookOpen, PenBox, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import type { LearningPathAllRelations } from "@/server/db/schema";
import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function PathView({ path }: { path: LearningPathAllRelations }) {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex place-items-center justify-between align-middle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Path</h1>
          <p className="text-sm font-medium text-neutral-500">
            Your ultimate step to mastery
          </p>
        </div>
        <Link href={`/course/action/new__${path.id}`}>
          <button
            className={
              "rounded-2xl border-2 border-b-4 border-green-600 bg-green-500 p-2 px-6 text-sm font-medium text-white transition-all duration-300 ease-out hover:translate-y-0.5 hover:border-b-2"
            }
          >
            Create Course
          </button>
        </Link>
      </div>

      <Card className="mb-12 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="gap:6 flex place-items-center justify-start align-middle">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl">
              <Image
                src={path.imageUrl ?? "/placeholder.svg"}
                alt={path.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-x-4 space-y-1">
              <Badge
                variant="secondary"
                className={cn(
                  "bg-orange-100 text-[11px] text-orange-700 hover:bg-orange-100 hover:text-orange-700",
                )}
              >
                322 IN PROGRESS
              </Badge>
              <Badge
                variant="secondary"
                className={cn(
                  "bg-green-100 text-[11px] text-green-700 hover:bg-green-100 hover:text-green-700",
                )}
              >
                12 COMPLETED
              </Badge>
              <CardTitle className="text-2xl">{path.title}</CardTitle>
              <p className="text-sm font-medium text-neutral-500">
                {path.description}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href={`/learning-paths/${path.id}`}>
              <Button className="w-full" variant={"outline"}>
                <PenBox color="#222" size={16} />
                Edit
              </Button>
            </Link>
            <Button disabled className="w-full" variant={"destructive"}>
              <Trash2Icon color="#fff" strokeWidth={2.2} size={16} />
              Delete
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-12">
        {path.levels?.map((level) => (
          <div key={level.id} className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-neutral-500">
                LEVEL {level.number}
              </h2>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {level.courses?.map((course) => (
                <div className="relative" key={course.id}>
                  <Link href={`/course/${course.id}`} className="h-[16.5rem]">
                    <Card className="group h-full rounded-3xl border-2 border-b-8 shadow-none transition-all hover:translate-y-1 hover:border-b-2">
                      <CardContent className="p-6">
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                          <div
                            className={`h-full w-full p-6`}
                            style={{
                              backgroundColor:
                                path.colorScheme?.s800 ?? "skyblue",
                            }}
                          >
                            <Image
                              src={course.imageUrl ?? "/placeholder.svg"}
                              alt={course.title}
                              width={200}
                              height={200}
                              className="h-full w-full object-contain transition-transform group-hover:scale-105"
                            />
                          </div>
                          {course.isUpdated && (
                            <Badge className="absolute right-2 top-2 bg-blue-500 text-white hover:bg-blue-600">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <h3 className="mt-2 text-[11px] font-medium text-neutral-400">
                          LEVEL {course.levelNumber ?? level.number}
                        </h3>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm font-medium text-neutral-600">
                          {course.description}
                        </p>
                        {course.desktopOnly && (
                          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4" />
                            <span>Desktop only</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                  <button
                    className="absolute right-2 top-2 grid aspect-square w-10 place-items-center rounded-full bg-black/10 p-2 align-middle"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/course/action/${course.id}`);
                    }}
                  >
                    <IconEdit width={20} strokeWidth={2.4} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
