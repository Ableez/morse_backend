"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Card, CardContent } from "#/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import { api } from "#/trpc/react";
import Image from "next/image";
import { toast } from "#/hooks/use-toast";
import { Stars } from "lucide-react";
import { isValidUrl } from "#/lib/utils";

const formSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase, numbers, and hyphens only",
    }),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  colors: {
    id: string;
    colorName: string;
    defaultColor: string | null;
    s100: string | null;
    s200: string | null;
    s300: string | null;
    s400: string | null;
    s500: string | null;
    s600: string | null;
    s700: string | null;
    s800: string | null;
    s900: string | null;
  }[];
  pathId?: string;
};

export default function CreateEditLearningPathForm({ pathId, colors }: Props) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(
    "https://media.istockphoto.com/id/1907918459/photo/white-checkered-crumpled-paper-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=q6wJaVMIMjE4CUtGhaEhErO1QiimBEYw6cbBoIdcWak=",
  );
  const [colorSchemeId, setCOlorSchemeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsDirty] = useState(false);

  const createPath = api.learning.createLearningPath.useMutation();
  const updatePath = api.learning.updateLearningPath.useMutation();
  const { data: existingPath } = api.learning.getPathById.useQuery(
    pathId ?? "",
    { enabled: !!pathId },
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (existingPath) {
      form.reset({
        slug: existingPath.slug,
        title: existingPath.title,
        description: existingPath.description ?? "",
        imageUrl: existingPath.imageUrl ?? "",
      });
      setPreviewImage(existingPath.imageUrl ?? previewImage);
      setIsDirty(false);
    }
  }, [existingPath, form, previewImage]);

  useEffect(() => {
    const savedData = localStorage.getItem(`learningPath_${pathId ?? "new"}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData) as FormData;
      form.reset(parsedData);
      setPreviewImage(parsedData.imageUrl ?? previewImage);
      setIsDirty(true);
    }
  }, [pathId, form, previewImage]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIsDirty(true);
      localStorage.setItem(
        `learningPath_${pathId ?? "new"}`,
        JSON.stringify(value),
      );
    });
    return () => subscription.unsubscribe();
  }, [form, pathId]);

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    try {
      if (pathId) {
        await updatePath.mutateAsync({
          id: pathId,
          colorSchemeId: colorSchemeId,
          ...values,
        });
        toast({
          title: "Success",
          description: "Learning path updated successfully",
        });
      } else {
        await createPath.mutateAsync(values);
        toast({
          title: "Success",
          description: "Learning path created successfully",
        });
      }
      localStorage.removeItem(`learningPath_${pathId ?? "new"}`);
      router.refresh();
    } catch (error: unknown) {
      console.log("ERROR SHITT AGAIN!", error);
      toast({
        title: "Error",
        description: `Failed to ${pathId ? "update" : "create"} learning path`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDirty(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-2 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex h-44 flex-wrap gap-4 overflow-y-scroll">
            {colors.map((color) => {
              console.log("COLOR SCHEME ID: ", colorSchemeId === color.id);
              return (
                <div
                  onClick={() => setCOlorSchemeId(color.id)}
                  key={color.colorName}
                  className={`${colorSchemeId === color.id ? "border-blue-400 hover:border-blue-400" : ""} box-border aspect-square h-12 w-12 cursor-pointer rounded-2xl border-4 border-transparent transition-all duration-200 ease-out hover:scale-[1.05] hover:border-blue-200 md:h-16 md:w-16 md:rounded-3xl`}
                  style={{
                    backgroundColor:
                      color.defaultColor ?? color.s300 ?? "#343434",
                  }}
                ></div>
              );
            })}
          </div>
          <div className="flex w-full place-items-center justify-between gap-1 rounded-xl border border-black/10 p-2 align-middle">
            {Object.entries(
              colors
                .slice(2, colors.length)
                .find((color) => color.id === colorSchemeId) ?? {
                color: "#eb0",
              },
            ).map((color) => (
              <div
                style={{ backgroundColor: color[1] ?? "#eb0" }}
                key={color[0]}
                className="h-4 w-full rounded-2xl border border-black/10"
              ></div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="foundational-math"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This will be used in the URL. Use lowercase letters, numbers,
                  and hyphens only.
                </FormDescription>
                <Button
                  className="flex gap-2 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-500 font-semibold !text-white"
                  type="button"
                  onClick={() => {
                    form.setValue(
                      "slug",
                      form.getValues().title.toLowerCase().replace(/\s+/g, "-"),
                    );
                  }}
                  disabled={isLoading}
                >
                  <Stars size={18} color="#fff" /> Generate
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Foundational Math"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Master problem solving essentials in math"
                    className="resize-none"
                    {...field}
                    maxLength={500}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.png"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const val = form.getValues("imageUrl");
                    if (isValidUrl(val))
                      setPreviewImage(val ?? "https://github.com/shadcn.png");
                  }}
                  disabled={isLoading}
                >
                  Set Image
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : pathId
                ? "Update Learning Path"
                : "Create Learning Path"}
          </Button>
        </form>
      </Form>

      <Card className="rounded-3xl p-2 md:p-6">
        <h2 className="mb-4 text-base font-semibold md:text-2xl">Preview</h2>
        <CardContent className="p-0">
          <div className="mx-auto w-full cursor-pointer overflow-clip rounded-3xl border-2 border-b-8 bg-white transition-all duration-300 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-[0.98] active:border-b-2 md:w-[80%]">
            <div
              className="w-full pt-4"
              style={{
                backgroundColor: `${
                  colors.find((color) => color.id === colorSchemeId)?.s800 ??
                  "#FFFFFF"
                }`,
              }}
            >
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Learning Path Preview"
                width={200}
                height={200}
                className="mx-auto aspect-square object-cover"
              />
            </div>

            <div className="flex min-h-32 flex-col justify-center px-4 py-4">
              <div className="text-[11px] font-medium text-neutral-400">
                <span> {existingPath?.levels.length ?? 0} LEVELS </span>
              </div>
              <h3 className="mb-1 text-xl font-bold text-black">
                {form.watch("title").trim() || "Learning Path Title"}
              </h3>
              <p className="text-[13px] text-neutral-600">
                {form.watch("description")?.trim() ??
                  "Learning path description will appear here."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
