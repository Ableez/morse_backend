import type { LearningPathWithRelations } from "#/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Button } from "#/components/ui/button";

type Props = {
  path: LearningPathWithRelations;
};

const PathInfo = ({ path }: Props) => {
  if (!path) {
    return (
      <div className="text-center text-lg font-semibold">Path not found</div>
    );
  }

  return (
    <Card className="mx-auto mt-32 max-w-3xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={path.imageUrl ?? "/3d_empty.png"}
          alt={path.title}
          width={60}
          height={60}
          className="rounded-full"
        />
        <CardTitle>{path.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {path.levels?.map(({ number, id }) => (
            <Link href={id} key={id}>
              <Button variant="outline" className="h-24 w-full">
                Level {number}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PathInfo;
