"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import Image from "next/image";
import { Stars } from "lucide-react";
import { isValidUrl } from "@/lib/utils";
import type { LearningPathWithRelations } from "@/server/db/schema";
import CreateLevelDialog from "../dialogs/create-level";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase, numbers, and hyphens only",
    }),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  levelId: z.string().uuid(),
  pathId: z.string().uuid(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateEditCourseFormProps {
  courseId?: string;
  learningPathData: LearningPathWithRelations;
}

export default function CreateEditCourseForm({
  courseId,
  learningPathData,
}: CreateEditCourseFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<FormData>>({
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    pathId: learningPathData.id,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [previewImage, setPreviewImage] = useState(
    "https://media.istockphoto.com/id/1907918459/photo/white-checkered-crumpled-paper-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=q6wJaVMIMjE4CUtGhaEhErO1QiimBEYw6cbBoIdcWak=",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const createCourse = api.learning.createCourse.useMutation();
  const updateCourse = api.learning.updateCourse.useMutation();
  const { data: existingCourse } = api.learning.getCourseById.useQuery(
    { courseId: courseId ?? "" },
    { enabled: !!courseId },
  );

  useEffect(() => {
    if (existingCourse) {
      setFormData({
        ...existingCourse,
        imageUrl: existingCourse.imageUrl ?? "",
        description: existingCourse.description ?? "",
      });
      setPreviewImage(existingCourse.imageUrl ?? previewImage);
      setSelectedLevel(existingCourse.levelId);
    }
  }, [existingCourse, previewImage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FormData,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const generateSlug = () => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.title?.toLowerCase().replace(/\s+/g, "-") ?? "",
      }));
    }
  };

  const validateForm = () => {
    try {
      formSchema.parse({
        ...formData,
        levelId: selectedLevel!,
        pathId: learningPathData.id,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLevel) {
      toast({
        title: "Error",
        description: "Please select a level",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const submissionData = {
        ...formData,
        levelId: selectedLevel,
        pathId: learningPathData.id,
      } as FormData;

      if (courseId) {
        await updateCourse.mutateAsync({
          id: courseId,
          ...submissionData,
        });
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        await createCourse.mutateAsync(submissionData);
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }
      router.push(`/learning-paths/d/${learningPathData.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${courseId ? "update" : "create"} course`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-2 md:p-8">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="flex h-24 w-full flex-wrap gap-2 overflow-y-scroll py-1">
          {learningPathData.levels?.map((level) => (
            <button
              type="button"
              className={`${
                selectedLevel === level.id
                  ? "border-green-600 bg-green-400"
                  : "border-neutral-300"
              } rounded-2xl border-2 border-b-4 px-6 py-1.5 text-sm font-medium shadow-sm transition-all duration-100 ease-out hover:translate-y-0.5 hover:border-b-2`}
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
            >
              Level {level.number}
            </button>
          ))}
          <CreateLevelDialog
            pathId={learningPathData.id}
            index={(learningPathData.levels?.length ?? 0) + 1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => handleInputChange(e, "title")}
            disabled={isLoading}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <Input
            placeholder="generate-a-slug"
            value={formData.slug}
            onChange={(e) => handleInputChange(e, "slug")}
            disabled={isLoading}
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            This will be used in the URL. Use lowercase letters, numbers, and
            hyphens only.
          </p>
          <Button
            className="flex gap-2 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-500 font-semibold !text-white"
            type="button"
            onClick={generateSlug}
            disabled={isLoading}
          >
            <Stars size={18} color="#fff" /> Generate
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            placeholder="A simple course description"
            className={`resize-none ${errors.description ? "border-red-500" : ""}`}
            value={formData.description}
            onChange={(e) => handleInputChange(e, "description")}
            maxLength={500}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Enter a URL"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange(e, "imageUrl")}
              disabled={isLoading}
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            <Button
              type="button"
              onClick={() => {
                if (formData.imageUrl && isValidUrl(formData.imageUrl)) {
                  setPreviewImage(formData.imageUrl);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Error in the URL",
                    description:
                      "This may not be a valid URL, find another image. Check out Vecteezy or Unsplash vector images",
                  });
                }
              }}
              disabled={isLoading}
            >
              Preview
            </Button>
          </div>
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? "Loading..."
            : courseId
              ? "Update Course"
              : "Create Course"}
        </Button>
      </form>

      <Card className="rounded-3xl p-2 md:p-6">
        <h2 className="mb-4 text-base font-semibold md:text-2xl">Preview</h2>
        <CardContent className="p-0 pt-8">
          <div className="mx-auto w-full cursor-pointer overflow-clip rounded-3xl border-2 border-b-8 bg-white transition-all duration-300 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-[0.98] active:border-b-2 md:w-[80%]">
            <div className="w-full bg-white pt-4">
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Course Preview"
                width={200}
                height={200}
                className="mx-auto aspect-square object-cover"
              />
            </div>

            <div className="flex min-h-24 flex-col justify-center px-4 py-4">
              <h3 className="mb-1 text-xl font-bold text-black">
                {formData.title?.trim() ?? "Course Title"}
              </h3>
              <p className="text-[13px] text-neutral-600">
                {formData.description?.trim() ??
                  "Course description will appear here."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
