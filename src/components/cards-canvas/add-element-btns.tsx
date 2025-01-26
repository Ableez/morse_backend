"use client";

import { Button } from "@/components/ui/button";
import { Type, ImageIcon, List, Sigma } from "lucide-react";
import { IconSlideshow } from "@tabler/icons-react";
import { useEditor } from "./editor-context";
import { memo, useState, type ComponentType } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

interface EditorActions {
  addText: (content: string, style: "bold" | "default") => void;
  addImage: (url: string) => void;
  addCarousel: (images: string[], autoPlay: boolean, showDots: boolean) => void;
  addOptions: (options: string[], correctIndex: number) => void;
  addKatexExpression: (content: string, displayMode?: boolean) => void;
}

export const ElementCreationButtons = memo(function ElementCreationButtons() {
  const { addText, addImage, addCarousel, addOptions, addKatexExpression } =
    useEditor() as EditorActions;
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAns, setCorrectAns] = useState<number | null>(null);

  const handleAddOptions = () => {
    const filledOptions = options.filter((opt) => opt.trim() !== "");
    const isValidAns =
      correctAns !== null && correctAns >= 0 && correctAns < options.length;

    if (filledOptions.length < 2) {
      alert("Please fill at least 2 options");
      return false;
    }

    if (!isValidAns) {
      alert("Please select a valid correct answer");
      return false;
    }

    addOptions(options, correctAns);
    setOptions(["", ""]);
    setCorrectAns(null);
    return true;
  };

  return (
    <div className="space-y-2">
      <ToolbarButton
        label="Add Bold Text"
        Icon={Type}
        onClick={() => addText("Bold text", "bold")}
      />
      <ToolbarButton
        label="Add Text"
        Icon={Type}
        onClick={() => addText("Default text", "default")}
      />
      <ToolbarButton
        label="Add Image"
        Icon={ImageIcon}
        onClick={() =>
          addImage(
            "https://adaptcommunitynetwork.org/wp-content/uploads/2022/01/ef3-placeholder-image.jpg",
          )
        }
      />
      <ToolbarButton
        label="Add Carousel"
        Icon={IconSlideshow}
        onClick={() => addCarousel([], true, true)}
      />
      <OptionToolbarButton
        label="Add Options"
        Icon={List}
        openOptions={openOptions}
        setOpenOptions={setOpenOptions}
        options={options}
        setOptions={setOptions}
        correctAns={correctAns}
        setCorrectAns={setCorrectAns}
        onClick={handleAddOptions}
      />
      <ToolbarButton
        label="Add Inline Math"
        Icon={Sigma}
        onClick={() => addKatexExpression("", false)}
      />

      <ToolbarButton
        label="Add Block Math"
        Icon={Sigma}
        onClick={() => addKatexExpression("", true)}
      />
    </div>
  );
});

interface ToolbarButtonProps {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}

const ToolbarButton = memo(function ToolbarButton({
  label,
  Icon,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Button
      className="w-full justify-between"
      variant="ghost"
      onClick={onClick}
    >
      {label}
      <Icon className="h-4 w-4" />
    </Button>
  );
});

interface OptionToolbarButtonProps {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  onClick: () => boolean;
  openOptions: boolean;
  setOpenOptions: (open: boolean) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  correctAns: number | null;
  setCorrectAns: (crans: number | null) => void;
}

const OptionToolbarButton = memo(function OptionToolbarButton({
  label,
  Icon,
  onClick,
  openOptions,
  setOpenOptions,
  options,
  setOptions,
  correctAns,
  setCorrectAns,
}: OptionToolbarButtonProps) {
  const handleAddOption = () => {
    if (options.length >= 4) return;
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    if (correctAns !== null) {
      if (correctAns === index) {
        setCorrectAns(null);
      } else if (correctAns > index) {
        setCorrectAns(correctAns - 1);
      }
    }
  };

  return (
    <div>
      <Button
        className="w-full justify-between"
        variant="ghost"
        onClick={() => setOpenOptions(true)}
      >
        {label}
        <Icon className="h-4 w-4" />
      </Button>

      <Dialog open={openOptions} onOpenChange={setOpenOptions}>
        <DialogContent>
          <DialogTitle>Add options</DialogTitle>
          <div className="w-full space-y-4">
            <div className="flex flex-col gap-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                  {options.length > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 4 && (
              <Button
                variant="outline"
                onClick={handleAddOption}
                className="w-full"
              >
                + Add Option
              </Button>
            )}

            <select
              value={correctAns ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCorrectAns(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className="w-full rounded border p-2"
            >
              <option value="" disabled>
                Select correct answer
              </option>
              {options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>

            <Button
              onClick={() => {
                const success = onClick();
                if (success) setOpenOptions(false);
              }}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
