import type { LearningPathWithRelations } from "#/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "#/components/ui/card";

const PathItem = ({
  path,
  queryString,
}: {
  path: LearningPathWithRelations;
  queryString: string;
}) => {
  return (
    <Link href={queryString}>
      <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <CardHeader className="flex items-center justify-center p-4">
          <Image
            src={path.imageUrl ?? "/3d_empty.png"}
            alt={path.title}
            width={80}
            height={80}
            className="rounded-full"
          />
        </CardHeader>
        <CardContent>
          <h4 className="text-center text-sm font-semibold">{path.title}</h4>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PathItem;
