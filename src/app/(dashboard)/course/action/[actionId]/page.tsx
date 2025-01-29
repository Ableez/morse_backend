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

  const courseData = await api.learning.getCourseById({ courseId: actionId });
  if (!courseData) {
    return <div>Course not found</div>;
  }

  console.log("COURSE DATA: ", courseData);

  const learningPathData = await api.learning.getPathById(courseData.pathId);
  if (!learningPathData) {
    return <div>Course is not valid, contact support</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="px-8">
        <h1 className="mb-8 text-base font-bold md:px-0 md:text-4xl">
          Edit course
        </h1>
      </div>

      <CreateEditCourseForm
        learningPathData={learningPathData}
        courseId={isEdit ? actionId : undefined}
        courseData={courseData}
      />
    </div>
  );
};

export default CourseActionPage;
