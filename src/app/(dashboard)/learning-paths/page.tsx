import { api } from "@/trpc/server";
import React from "react";

const LearningPath = async () => {
  const learningPaths = await api.learning.getAllPaths();

  console.log("LEARNINGPATHS", JSON.stringify(learningPaths.slice(0, 2)));
  return <div>Learning</div>;
};

export default LearningPath;
