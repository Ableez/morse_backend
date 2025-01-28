import CreateEditCourseForm from "@/components/course/create-edit-course";
import { api } from "@/trpc/server";

type Props = {
  params: Promise<{ actionId: string }>;
};

const CourseActionPage = async ({ params }: Props) => {
  const { actionId } = await params;
  const isEdit = actionId.split("__")[0] !== "new";
  const isNew = actionId.split("__")[0] === "new";

  if (isNew && actionId.split("__")[1]) {
    const learningPathData = await api.learning.getPathById(
      actionId.split("__")[1]!,
    );

    return (
      <div className="container mx-auto py-10">
        <div className="px-8">
          <h1 className="mb-8 text-base font-bold md:px-0 md:text-4xl">
            Create New Course
          </h1>
        </div>

        <CreateEditCourseForm
          learningPathData={learningPathData}
          courseId={isEdit ? actionId : undefined}
        />
      </div>
    );
  }
};

export default CourseActionPage;
