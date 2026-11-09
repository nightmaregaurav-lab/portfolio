"use client"

import React, {useState} from 'react';
import {Image as ImageIcon, XIcon} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
  InputGroupAddon,
} from "@/components/ui/input-group";
import GithubFilePicker from "@/components/ui/GithubFilePicker";
import {useGitHubPatAuth} from "@/hooks/useGitHubPatAuth";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import SmartLink from "@/components/ui/SmartLink";

type FileUrlArrayProps = Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value?: string[];
  onChange?: (value: string[]) => void;
};

function isLink(value: string) {
  return /^https?:\/\//i.test(value);
}

function FileUrlArray({
  value,
  onChange,
  className,
  id,
  placeholder = "https://example.com/image.jpg",
  ...props
}: FileUrlArrayProps) {
  const [inputValue, setInputValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const {gitHubSession} = useGitHubPatAuth();

  function addValue(valueToAdd = inputValue) {
    const nextValue = valueToAdd.trim();
    if (!nextValue) return;
    if (!(value || []).some((item) => item.toLocaleLowerCase() === nextValue.toLocaleLowerCase())) {
      onChange?.([...(value || []), nextValue]);
    }
    setInputValue("");
  }

  function removeValue(index: number) {
    onChange?.((value || []).filter((_, valueIndex) => valueIndex !== index));
  }

  function handleSelect(url: string) {
    addValue(url);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <InputGroup>
        <InputGroupInput
          type="url"
          id={id}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setShowPicker(true)}
            aria-label="Open file picker"
          >
            <ImageIcon size={14} aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {value && value.length > 0 && (
        <div className={"flex flex-wrap gap-2"}>
          {value.map((item, index) => (
            <span key={`${item}-${index}`} className={"inline-flex max-w-full items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"}>
              {isLink(item) ? (
                <SmartLink href={item} target={"_blank"} rel={"noreferrer"} className={"max-w-[18rem] truncate hover:underline"}>
                  {item}
                </SmartLink>
              ) : (
                <span className={"max-w-[18rem] truncate"}>{item}</span>
              )}
              <Button
                type={"button"}
                variant={"ghost"}
                size={"icon-xs"}
                aria-label={`Remove ${item}`}
                className={"ml-1 shrink-0 rounded-sm text-primary-foreground transition-transform hover:scale-110 hover:bg-primary-foreground/20 active:scale-95"}
                onClick={() => removeValue(index)}
              >
                <XIcon size={12} />
              </Button>
            </span>
          ))}
        </div>
      )}

      <Dialog
        open={showPicker}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setShowPicker(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogTitle>Select Files</DialogTitle>
          {gitHubSession ? (
            <GithubFilePicker onSelect={handleSelect} selectedUrls={value || []} />
          ) : (
            <span className={"text-gray-500"}>
              You have not logged in yet. Please log in to use the file picker.
            </span>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export {FileUrlArray};
