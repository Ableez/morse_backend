"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Card, CardContent } from "#/components/ui/card";
import { api } from "#/trpc/react";
import Image from "next/image";
import { Stars } from "lucide-react";
import { isValidUrl } from "#/lib/utils";
import type {
  CourseWithRelations,
  LearningPathWithRelations,
} from "#/server/db/schema";
import CreateLevelDialog from "../dialogs/create-level";
import { toast } from "#/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, numbers, and hyphens only",
    ),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  levelId: z.string().uuid("Please select a level"),
  pathId: z.string().uuid(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateEditCourseFormProps {
  courseId?: string;
  learningPathData: LearningPathWithRelations;
  courseData?: CourseWithRelations;
}

const FORM_STORAGE_KEY = "courseFormState";

export default function CreateEditCourseForm({
  courseId,
  learningPathData,
  courseData,
}: CreateEditCourseFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: courseData!
      ? {
          ...courseData,
          imageUrl: courseData.imageUrl ?? "",
          description: courseData.description ?? undefined,
        }
      : {
          pathId: learningPathData.id,
          levelId: "",
          title: "",
          slug: "",
          description: "",
          imageUrl: "",
        },
  });

  const { data: learningPath, refetch: refetchPath } =
    api.learning.getPathById.useQuery(learningPathData.id, {
      initialData: learningPathData as unknown as LearningPathWithRelations,
      enabled: !courseId,
    });

  const createCourse = api.learning.createCourse.useMutation();
  const updateCourse = api.learning.updateCourse.useMutation();

  const imageUrl = watch("imageUrl");
  const selectedLevel = watch("levelId");

  // Local storage persistence
  useEffect(() => {
    if (courseId) return;
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      reset(JSON.parse(savedData) as unknown as FormData);
    }
  }, [reset, courseId]);

  useEffect(() => {
    if (courseId) return;
    const subscription = watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, courseId]);

  const generateSlug = () => {
    const title = watch("title");
    if (title) {
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      setValue("slug", slug, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (courseId) {
        await updateCourse.mutateAsync({ ...data, id: courseId });
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        await createCourse.mutateAsync(data);
        toast({ title: "Success", description: "Course created successfully" });
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
      router.push(`/learning-paths/d/${learningPathData.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${courseId ? "update" : "create"} course`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-2 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex h-24 w-full flex-wrap gap-2 overflow-y-scroll py-1">
          {learningPath?.levels?.map((level) => (
            <button
              type="button"
              className={`${
                selectedLevel === level.id
                  ? "border-green-600 bg-green-500"
                  : "border-neutral-300"
              } h-fit rounded-2xl border-2 border-b-4 px-6 py-1.5 text-sm font-medium shadow-sm transition-all duration-100 ease-out hover:translate-y-0.5 hover:border-b-2`}
              key={level.id}
              onClick={() =>
                setValue("levelId", level.id, { shouldValidate: true })
              }
            >
              <div>Level {level.number}</div>
            </button>
          ))}
          <CreateLevelDialog
            pathId={learningPathData.id}
            index={(learningPath?.levels?.length ?? 0) + 1}
            onSuccess={refetchPath}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>
          <Input
            placeholder="Course Title"
            {...register("title")}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-destructive mt-1 text-sm">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Slug</label>
          <Input
            placeholder="generate-a-slug"
            {...register("slug")}
            className={errors.slug ? "border-destructive" : ""}
          />
          {errors.slug && (
            <p className="text-destructive mt-1 text-sm">
              {errors.slug.message}
            </p>
          )}
          <p className="text-muted-foreground mt-1 text-sm">
            This will be used in the URL. Use lowercase letters, numbers, and
            hyphens only.
          </p>
          <Button
            type="button"
            onClick={generateSlug}
            variant="secondary"
            className="mt-2 gap-2"
          >
            <Stars size={18} /> Generate
          </Button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <Textarea
            placeholder="A simple course description"
            {...register("description")}
            className={`resize-none ${errors.description ? "border-destructive" : ""}`}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-destructive mt-1 text-sm">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Image URL</label>
          <Input
            placeholder="Enter a valid image URL"
            {...register("imageUrl")}
            className={errors.imageUrl ? "border-destructive" : ""}
          />
          {errors.imageUrl && (
            <p className="text-destructive mt-1 text-sm">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? "Processing..."
            : courseId
              ? "Update Course"
              : "Create Course"}
        </Button>
      </form>

      <CoursePreview
        title={watch("title")}
        description={watch("description")}
        imageUrl={isValidUrl(imageUrl) ? imageUrl! : "/placeholder.svg"}
        learningPathTitle={learningPath?.title || ""}
        selectedLevel={
          learningPath?.levels?.find((l) => l.id === selectedLevel)?.number
        }
      />
    </div>
  );
}

const CoursePreview = ({
  title,
  description,
  imageUrl,
  learningPathTitle,
  selectedLevel,
}: {
  title?: string;
  description?: string;
  imageUrl: string;
  learningPathTitle: string;
  selectedLevel?: number;
}) => (
  <Card className="rounded-3xl p-2 md:p-6">
    <h2 className="mb-4 text-base font-semibold md:text-2xl">Preview</h2>
    <CardContent className="p-0 pt-8">
      <div className="mx-auto w-full cursor-pointer overflow-clip rounded-3xl border-2 border-b-8 bg-white transition-all duration-300 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-[0.98] active:border-b-2 md:w-[80%]">
        <div className="w-full bg-blue-100 p-4">
          <Image
            src={imageUrl}
            alt="Course Preview"
            width={140}
            height={140}
            className="mx-auto h-40 object-cover"
            onError={(e) => {
              console.error("Image load error:", e);
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="flex min-h-24 flex-col justify-center px-4 py-4">
          <p className="text-xs font-medium text-blue-600/80">
            {learningPathTitle} {selectedLevel && `· Level ${selectedLevel}`}
          </p>
          <h3 className="mb-1 text-xl font-bold text-black">
            {title?.trim() ?? "Course Title"}
          </h3>
          <p className="text-[13px] text-neutral-600">
            {description?.trim() ?? "Course description will appear here."}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
