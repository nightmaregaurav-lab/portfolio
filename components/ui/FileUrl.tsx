"use client"

import React, {useState} from 'react';
import {Image as ImageIcon} from "lucide-react";
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

type FileUrlProps = Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value?: string;
  onChange?: (value: string) => void;
};

function FileUrl({
  value,
  onChange,
  className,
  id,
  placeholder = "https://example.com/image.jpg",
  ...props
}: FileUrlProps) {
  const [showPicker, setShowPicker] = useState(false);
  const {gitHubSession} = useGitHubPatAuth();

  function handleSelect(url: string) {
    onChange?.(url);
    setShowPicker(false);
  }

  return (
    <>
      <InputGroup className={className}>
        <InputGroupInput
          type="url"
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
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

      <Dialog
        open={showPicker}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setShowPicker(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogTitle>Select a File</DialogTitle>
          {gitHubSession ? (
            <GithubFilePicker onSelect={handleSelect} selectedUrls={value ? [value] : []} />
          ) : (
            <span className={"text-gray-500"}>
              You have not logged in yet. Please log in to use the file picker.
            </span>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export {FileUrl};
