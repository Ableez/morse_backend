"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Stars } from "lucide-react";
import { isValidUrl } from "@/lib/utils";

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

type Props = {
  params: Promise<{ pathId: string }>;
};
export default function CreateLearningPathForm({ params }: Props) {
  const { pathId } = use(params);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(
    "https://media.istockphoto.com/id/1907918459/photo/white-checkered-crumpled-paper-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=q6wJaVMIMjE4CUtGhaEhErO1QiimBEYw6cbBoIdcWak=",
  );
  const createPath = api.learning.createLearningPath.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPath.mutateAsync(values);
      toast({
        title: "Success",
        description: "Learning path created successfully",
      });
      router.push("/learning-paths");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create learning path",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-2 md:grid-cols-2 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="foundational-math" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used in the URL. Use lowercase letters, numbers,
                  and hyphens only.
                </FormDescription>
                <Button
                  className="flex gap-2 bg-gradient-to-br from-blue-500 via-purple-600 to-purple-500 font-semibold !text-white"
                  type={"button"}
                  onClick={() => {
                    form.setValue(
                      "slug",
                      form.getValues().title.toLowerCase().replace(" ", "-"),
                    );
                  }}
                >
                  <Stars size={18} color={"#fff"} /> Generate
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
                  <Input placeholder="Foundational Math" {...field} />
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
                    maxLength={100}
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
                  />
                </FormControl>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    const val = form.getValues("imageUrl");
                    if (isValidUrl(val))
                      setPreviewImage(val ?? "https://github.com/shadcn.png");
                  }}
                >
                  Set Image
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Learning Path</Button>
        </form>
      </Form>

      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Preview</h2>
        <CardContent className="p-0">
          <div className="mx-auto w-[80%] cursor-pointer overflow-clip rounded-3xl border-2 border-b-8 bg-white transition-all duration-300 ease-out hover:-translate-y-2 active:translate-y-1 active:scale-[0.98] active:border-b-2">
            <Image
              src={previewImage ?? "https://github.com/shadcn.png"}
              alt="Learning Path Preview"
              width={800}
              height={800}
              className="mx-auto h-56 object-cover"
            />

            <div className="flex min-h-32 flex-col justify-center px-4 py-4">
              <div className="text-[10px] font-medium text-neutral-500">
                <span>0 LEVELS </span>
                <span>0 COURSES</span>
              </div>
              <h3 className="mb-1 text-xl font-bold text-black">
                {form.watch("title").trim().length > 0
                  ? form.watch("title")
                  : "Learning Path Title"}
              </h3>
              <p className="text-[13px] text-neutral-600">
                {form.watch("description")!.trim().length > 0
                  ? form.watch("description")
                  : "Learning path description will appear here. "}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
