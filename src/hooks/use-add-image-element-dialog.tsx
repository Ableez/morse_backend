"use client";

import React, { useState } from "react";
import { UploadDropzone } from "#/lib/uploadthing";
import { useToast } from "#/hooks/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";

type Props = {
  onUploadComplete: (url: string) => void;
};

export const useAddImageElementDialog = ({
  onUploadComplete,
}: Props): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => React.JSX.Element,
] => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const renderElement = () => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Change Image</DialogTitle>
          <UploadDropzone
            endpoint={"imageUploader"}
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              toast({ description: "Upload Completed" });
              if (!res[0]?.url) return;

              onUploadComplete(res[0]?.url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR UPLOADING SLIDE FILE! ${error.message}`);
            }}
          />
          <div className="flex flex-col place-items-center justify-center gap-1 align-middle text-lg font-semibold text-neutral-300">
            <div className="h-4 border-r-2 border-dashed border-neutral-300" />
            OR
          </div>
          <form
            action={(formData) => {
              const imageUrl = formData.get("imageUrl") as string;
              if (!imageUrl) return;
              onUploadComplete(imageUrl);
            }}
          >
            <Input
              placeholder="Insert image URL"
              className="mb-2 border-2"
              name={"imageUrl"}
              required
            />
            <DialogClose
              type={"submit"}
              className="w-full rounded-2xl bg-black p-2 text-white duration-300 hover:bg-black/90"
            >
              Insert Image
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return [open, setOpen, renderElement];
};
