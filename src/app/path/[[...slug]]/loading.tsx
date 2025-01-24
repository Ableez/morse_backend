import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full w-full place-items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;
