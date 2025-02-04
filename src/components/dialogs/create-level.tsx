import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconPlus, IconX } from "@tabler/icons-react";
import { api } from "#/trpc/react";
import { toast } from "#/hooks/use-toast";
import { UploadDropzone } from "#/lib/uploadthing";
import Image from "next/image";
import { isValidUrl } from "#/lib/utils";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

const levelSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  imageUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
  pathId: z.string().uuid("Invalid path ID"),
  index: z.number().int().min(0, "Level index must be positive"),
});

type LevelInput = z.infer<typeof levelSchema>;

interface CreateLevelDialogProps {
  open?: boolean;
  onClose?: () => void;
  pathId: string;
  index: number;
  onSuccess?: () => void;
}

const CreateLevelDialog = ({
  open,
  onClose,
  index,
  pathId,
  onSuccess,
}: CreateLevelDialogProps) => {
  const [localIsOpen, setLocalIsOpen] = React.useState(open);
  const [imagePreview, setImagePreview] = React.useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LevelInput>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      pathId,
      index,
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const createLevelMutation = api.learning.createLevel.useMutation();

  const handleImageInput = (url: string) => {
    setImagePreview(url);
    if (isValidUrl(url)) {
      setValue("imageUrl", url, { shouldValidate: true });
    } else {
      setValue("imageUrl", "", { shouldValidate: true });
    }
  };

  const handleImageUpload = (url: string) => {
    if (isValidUrl(url)) {
      setImagePreview(url);
      setValue("imageUrl", url, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: LevelInput) => {
    try {
      await createLevelMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Level created successfully",
      });
      reset();
      onClose?.();
      setLocalIsOpen(false);
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Failed to create level:", error);
      toast({
        title: "Error",
        description: "Failed to create level",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setLocalIsOpen(isOpen);
    if (!isOpen) {
      reset();
      onClose?.();
    }
  };

  return (
    <AlertDialog open={open ?? localIsOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <IconPlus className="mr-2" size={16} />
          Add a level
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className={"h-[90dvh] max-h-[90dvh] overflow-y-scroll"}
      >
        <AlertDialogCancel asChild>
          <Button
            className="absolute right-2 top-2 border-none bg-green-600 hover:bg-green-500"
            size={"icon"}
          >
            <IconX size={18} color={"#fff"} />
          </Button>
        </AlertDialogCancel>

        <AlertDialogTitle className="mb-4">Create New Level</AlertDialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            {/* Path ID (Read-only) */}
            <div>
              <label className="mb-1 block text-sm font-medium">Path ID</label>
              <Input
                {...register("pathId")}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              {errors.pathId && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.pathId.message}
                </p>
              )}
            </div>

            {/* Level Index (Read-only) */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Level Index
              </label>
              <Input
                {...register("index", { valueAsNumber: true })}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              {errors.index && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.index.message}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <Input
                {...register("title")}
                placeholder="Enter level title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <Input
                {...register("description")}
                placeholder="Enter level description"
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Paste image URL here"
                  value={imagePreview}
                  onChange={(e) => handleImageInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setImagePreview("");
                    setValue("imageUrl", "", { shouldValidate: true });
                  }}
                  disabled={!imagePreview}
                >
                  Clear
                </Button>
              </div>

              {imagePreview && isValidUrl(imagePreview) ? (
                <div className="relative mx-auto aspect-square w-[30%] overflow-hidden rounded-lg bg-purple-200 p-8">
                  <Image
                    src={imagePreview}
                    alt="Level preview"
                    fill
                    className="w-[80%] object-contain"
                    onError={(e) => {
                      console.error("Image load error:", e);
                      setImagePreview("");
                      setValue("imageUrl", "", { shouldValidate: true });
                    }}
                  />
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res[0]?.url ?? "";
                    handleImageUpload(url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: "Upload Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  }}
                  config={{
                    appendOnPaste: true,
                    mode: "auto",
                  }}
                  className="border-dashed"
                />
              )}
              {errors.imageUrl && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>

          <Button
            // type="submit"
            className="w-full"
            disabled={createLevelMutation.isPending}
          >
            {createLevelMutation.isPending ? "Creating..." : "Create Level"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateLevelDialog;
