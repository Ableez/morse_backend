import PathView from "@/components/path/path-view";
import { api } from "@/trpc/server";
import React from "react";

type Props = {
  params: Promise<{ pathId: string }>;
};

const PathId = async ({ params }: Props) => {
  const { pathId } = await params;
  const path = await api.learning.getPathById(pathId) ;

  if (!path) {
    return <div>Path not found</div>;
  }

  return <PathView path={path} />;
};

export default PathId;
