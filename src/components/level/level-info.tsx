import type { LevelWithRelations } from "@/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  level: LevelWithRelations;
};

const LevelInfo = ({ level }: Props) => {
  if (!level) {
    return (
      <div className="text-center text-lg font-semibold">Level not found</div>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Level {level.number}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {level.courses?.map((course) => (
            <Link href={course.id} key={course.id}>
              <Button variant="outline" className="h-24 w-full">
                {course.title}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelInfo;
