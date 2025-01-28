import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";

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
  const [localIsOpen, setLocalIsOpen] = useState(open);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LevelInput, string>>
  >({});

  // Controlled form state
  const [formState, setFormState] = useState({
    pathId: pathId,
    index: index,
    title: "",
    description: "",
    imageUrl: "",
  });

  const createLevelMutation = api.learning.createLevel.useMutation();

  const validateForm = () => {
    try {
      levelSchema.parse({
        ...formState,
        pathId,
        index: index,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof LevelInput, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LevelInput] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formState,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormState({
      index: index,
      pathId: pathId,
      title: "",
      description: "",
      imageUrl: "",
    });
    setErrors({});
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createLevelMutation.mutateAsync({
        ...formState,
        pathId,
        index,
      });
      toast({
        title: "Success",
        description: "Level created successfully",
      });
      resetForm();
      onClose?.();
      setLocalIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create level:", error);
      toast({
        title: "Error",
        description: "Failed to create level",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open ?? localIsOpen}
      onOpenChange={(e) => {
        setLocalIsOpen(e);
        if (!e) {
          resetForm();
          onClose?.();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconPlus className="mr-2" width={16} />
          Add a level
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a new level</DialogTitle>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Path ID"
              disabled
              value={formState.pathId}
              onChange={(e) => handleInputChange(e, "pathId")}
              className={errors.pathId ? "border-red-500" : ""}
            />
            {errors.pathId && (
              <p className="mt-1 text-sm text-red-500">{errors.pathId}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Level Index"
              value={formState.index}
              disabled
              onChange={(e) => handleInputChange(e, "index")}
              className={errors.index ? "border-red-500" : ""}
            />
            {errors.index && (
              <p className="mt-1 text-sm text-red-500">{errors.index}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Level title"
              value={formState.title}
              onChange={(e) => handleInputChange(e, "title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Level description"
              value={formState.description}
              onChange={(e) => handleInputChange(e, "description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {formState.imageUrl && (
            <Image
              src={formState.imageUrl}
              alt="Level image"
              className="h-auto w-full"
              width={300}
              height={300}
            />
          )}

          <div>
            <UploadDropzone
              endpoint={"imageUploader"}
              config={{
                appendOnPaste: true,
                mode: "auto",
              }}
              onClientUploadComplete={(res) => {
                const img = res[0]?.url;
                if (!img) return;

                setFormState((f) => ({ ...f, imageUrl: img }));
              }}
            />
          </div>

          <Button onClick={onSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Level"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLevelDialog;
