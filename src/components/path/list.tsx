"use client";

import type { LearningPathWithRelations } from "#/server/db/schema";
import { usePathname } from "next/navigation";
import PathItem from "./path-item";

const ListPaths = ({
  learningPaths,
}: {
  learningPaths: LearningPathWithRelations[];
}) => {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {learningPaths.map((path) => (
        <PathItem
          queryString={`${pathname}/${path.id}`}
          key={path.id}
          path={path}
        />
      ))}
    </div>
  );
};

export default ListPaths;
