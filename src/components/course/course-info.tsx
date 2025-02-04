import type { CourseWithRelations } from "#/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Button } from "#/components/ui/button";
import Link from "next/link";

type Props = {
  course: CourseWithRelations;
};

const CourseInfo = ({ course }: Props) => {
  if (!course) {
    return (
      <div className="text-center text-lg font-semibold">Course not found</div>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          course description will be shown here, when we got it.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {course.lessons?.map((lesson) => (
            <Link href={lesson.id} key={lesson.id}>
              <Button variant="outline" className="h-16 w-full">
                {lesson.title}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseInfo;
