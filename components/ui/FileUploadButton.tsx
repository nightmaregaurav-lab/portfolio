"use client"

import React, {useRef} from 'react';
import {Button} from "@/components/ui/button";
import {FileUp} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {GitHubCreateFileRequest} from "@/lib/gitHub";
import {confirm} from "@/components/ui/Confirm";

function FileUploadButton(
  {
    uploadingFiles,
    uploadFiles
  }: {
    uploadingFiles: boolean,
    uploadFiles: (files: GitHubCreateFileRequest[]) => Promise<number>
  }
) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let ghFiles: GitHubCreateFileRequest[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      ghFiles.push({
        name: file.name,
        content: file,
      });
    }

    let returned = await confirm({
      title: "Confirm Upload",
      message: `Are you sure you want to upload ${ghFiles.length} files? This will make these files publicly available.`,
      actions: [
        {
          label: "Cancel",
          onClick: async () => false,
          buttonProps: {
            variant: "outline",
            className: "cursor-pointer",
          },
        },
        {
          label: "Upload",
          onClick: async () => true,
          buttonProps: {
            className: "cursor-pointer",
          },
        },
      ],
    });

    try {
      if(returned) {
        await uploadFiles(ghFiles);
      }
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (<div className={"flex flex-col gap-1"}>
    <input
      ref={fileInputRef}
      type="file"
      multiple
      className="hidden"
      onChange={handleFileSelect}
    />
    <Button
      type="button"
      size={"lg"}
      className={"cursor-pointer hover:-translate-y-px"}
      disabled={uploadingFiles}
      onClick={() => fileInputRef.current?.click()}
    >
      <FileUp/> Upload Files
    </Button>
    {uploadingFiles && <span className={"flex flex-nowrap gap-1 align-center items-center"}>
      <Spinner/> Uploading...
    </span>}
  </div>);
}

export default FileUploadButton;
