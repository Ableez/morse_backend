import CreateEditLearningPathForm from "@/components/path/create-edit";
import { api } from "@/trpc/server";

type Props = {
  params: Promise<{ action: string }>;
};

const LearningPathActionPage = async ({ params }: Props) => {
  const { action } = await params;
  const isEdit = action !== "new";
  const pathId = isEdit ? action : undefined;
  const colors = await api.learning.getColorSchemes();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 px-4 text-lg font-bold md:px-0 md:text-4xl">
        {isEdit ? "Edit Learning Path" : "Create New Learning Path"}
      </h1>
      <CreateEditLearningPathForm colors={colors} pathId={pathId} />
    </div>
  );
};

export default LearningPathActionPage;
