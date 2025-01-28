import { api } from "@/trpc/server";
import React from "react";

const LearningPath = async () => {
  const learningPaths = await api.learning.getAllPaths();
  return <div>Learning</div>;
};

export default LearningPath;
