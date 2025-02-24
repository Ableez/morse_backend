import PathView from "#/components/path/path-view";
import type { LearningPathAllRelations } from "#/server/db/schema";
import { api } from "#/trpc/server";
import React from "react";

type Props = {
  params: Promise<{ pathId: string }>;
};

const PathViewPage = async ({ params }: Props) => {
  const { pathId } = await params;
  const path = await api.learning.getPathById(pathId);

  if (!path) {
    return <div>Path not found</div>;
  }

  return <PathView path={path as LearningPathAllRelations} />;
};

export default PathViewPage;
