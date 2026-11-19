"use client"

import React, {useState} from 'react';
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Download, Ellipsis, Grid, List, Trash} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {Separator} from "@/components/ui/separator";
import {useGitHubFolder} from "@/hooks/useGitHubFolder";
import {Input} from "@/components/ui/input";
import {useDebouncedState} from "@/hooks/useDebouncedState";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {getFileTypeFromExtension} from "@/lib/files";
import FileUploadButton from "@/components/ui/FileUploadButton";
import {confirm} from "@/components/ui/Confirm";
import ImageLightbox from "@/components/ui/ImageLightbox";
import GitHubFileGridCard from "@/components/ui/GitHubFileGridCard";
import GitHubFileListCard from "@/components/ui/GitHubFileListCard";

function GitHubFileManager(
  {className, path}: {
    className?: string,
    path: string
  }
) {
  const {
    state: searchKeyword,
    debouncedState: debouncedSearchKeyword,
    setState: setSearchKeyword
  } = useDebouncedState("", 500);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFileType, setSelectedFileType] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<{url: string, name: string} | null>(null);

  const {
    files,
    recentUploads,
    serverFiles,
    loadingFiles,
    deleteFiles,
    uploadFiles,
    uploadingFiles
  } = useGitHubFolder(path)

  async function onDownload(fileNames: string[]) {
    for (const fileName of fileNames) {
      const file = files?.find(f => f.name === fileName);
      if (file) {
        const link = document.createElement('a');
        link.href = file.download_url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  async function onDelete(fileNames: string[]) {
    const returned = await confirm({
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${fileNames.length} files? This action cannot be undone.`,
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
          label: "Delete",
          onClick: async () => true,
          buttonProps: {
            className: "cursor-pointer",
          },
        },
      ],
    });
    if (returned) {
      await deleteFiles(fileNames);
    }
  }

  const filteredFiles = serverFiles
    ?.filter(file => {
      const typeString = getFileTypeFromExtension(file.name);
      if(selectedFileType && typeString !== selectedFileType) {
        return false;
      }
      return file.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase());
      }
    );

  const filteredRecentUploads = recentUploads?.filter(file =>
    file.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
  );

  const fileTypes = serverFiles?.reduce((acc, file) => {
    const type = getFileTypeFromExtension(file.name);
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={cn("p-4", className)}>
      <div className={"flex flex-row justify-between align-center items-center gap-2"}>
        <div className={"flex flex-col gap-1"}>
          <span className={"text-xl font-bold"}>
            Asset Manager
          </span>
          <span className={"text-sm text-gray-500"}>
            Organize documents, files, and assets.
          </span>
        </div>
        <FileUploadButton
          uploadingFiles={uploadingFiles}
          uploadFiles={uploadFiles}
        />
      </div>
      <Separator className={"my-3"}/>
      <div className={"flex flex-row justify-between align-center items-center gap-2 mb-3"}>
        <Input
          placeholder={"Search files..."}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <span className={"flex flex-row gap-1"}>
          <Button
            type={"button"}
            size={"icon-sm"}
            onClick={() => setViewMode("grid")}
            variant={viewMode === "grid" ? "default" : "outline"}
            className={"cursor-pointer hover:-translate-y-px"}
          >
            <Grid/>
          </Button>
          <Button
            type={"button"}
            size={"icon-sm"}
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "default" : "outline"}
            className={"cursor-pointer hover:-translate-y-px"}
          >
            <List/>
          </Button>
        </span>
      </div>
      {loadingFiles && <div className={"flex flex-row justify-center align-center items-center"}>
        <Spinner className={"mr-1"}/> Loading...
      </div>}
      {!loadingFiles && (!serverFiles || serverFiles.length === 0) && (!filteredRecentUploads || filteredRecentUploads.length === 0) && <div className={"flex flex-row justify-center align-center items-center"}>
        <span className={"text-gray-500"}>No files found.</span>
      </div>}
      {!loadingFiles && serverFiles && serverFiles.length > 0 && filteredFiles && filteredFiles.length === 0 &&
       (!filteredRecentUploads || filteredRecentUploads.length === 0) && <div className={"flex flex-row justify-center align-center items-center"}>
        <span className={"text-gray-500"}>No files found matching the search criteria.</span>
      </div>}
      <div className={"flex flex-row gap-2 overflow-x-auto py-1 mb-3"}>
        {Object.entries(fileTypes ?? {}).map(([type, count], i) => (
          <Badge
            key={i}
            variant={"secondary"}
            onClick={() => setSelectedFileType(selectedFileType === type ? undefined : type)}
            className={cn(
              "cursor-pointer hover:bg-gray-300",
              {
                "bg-gray-300": selectedFileType === type,
                "border border-gray-400": selectedFileType === type,
              }
            )}
          >
            {`${type} (${count})`}
          </Badge>
        ))}
      </div>
      {selectedFiles.length > 0 && (<div className={"flex flex-row gap-2 mb-3 justify-between align-center items-center"}>
        <span className={"text-sm text-muted-foreground"}>
          {selectedFiles.length} file(s) selected
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type={"button"} size={"icon-sm"} variant="outline" className="cursor-pointer hover:-translate-y-px">
            <Ellipsis size={16} className="cursor-pointer" />
          </Button>} />
          <DropdownMenuContent className="w-auto border rounded-md bg-white shadow-lg">
            <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 pt-2 cursor-pointer flex flex-no gap-2" onClick={async () => {
              await onDownload(selectedFiles);
            }}>
              <Download size={14} />
              Download selected
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2" onClick={async () => {
              await onDelete(selectedFiles);
            }}>
              <Trash size={14} />
              Delete selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>)}

      {filteredRecentUploads && filteredRecentUploads.length > 0 && (
        <div className="mb-4">
          <div className={"flex flex-row justify-between align-center items-center mb-2"}>
            <span className={"text-sm font-semibold text-gray-700"}>Recent Uploads</span>
            <span className={"text-xs text-gray-500"}>
              {filteredRecentUploads.length} file(s) — syncing with server...
            </span>
          </div>
          <div
            className={cn(
              "grid gap-2",
              {
                "grid-cols-1 sm:grid-cols-2 md:grid-cols-3": viewMode === "grid",
                "flex flex-col": viewMode === "list",
              }
            )}
          >
            {filteredRecentUploads.map((file, i) => (viewMode === "grid" ? (<GitHubFileGridCard
              key={`recent-${i}`}
              file={file}
              isAnySelected={selectedFiles.length > 0}
              isSelected={selectedFiles.includes(file.name)}
              onSelectionChange={(selected) => {
                if (selected) {
                  setSelectedFiles([...selectedFiles, file.name]);
                } else {
                  setSelectedFiles(selectedFiles.filter(f => f !== file.name));
                }
              }}
              onView={async (url) => setImagePreview({url, name: file.name})}
              onDownload={undefined}
              onDelete={undefined}
            />) : (<GitHubFileListCard
              key={`recent-${i}`}
              file={file}
              isAnySelected={selectedFiles.length > 0}
              isSelected={selectedFiles.includes(file.name)}
              onSelectionChange={(selected) => {
                if (selected) {
                  setSelectedFiles([...selectedFiles, file.name]);
                } else {
                  setSelectedFiles(selectedFiles.filter(f => f !== file.name));
                }
              }}
              onView={async (url) => setImagePreview({url, name: file.name})}
              onDownload={undefined}
              onDelete={undefined}
            />)))}
          </div>
          <Separator className={"my-3"}/>
        </div>
      )}

      <div
        className={cn(
          "grid gap-2",
          {
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3": viewMode === "grid",
            "flex flex-col": viewMode === "list",
            "overflow-y-auto": viewMode === "list",
            "max-h-100": viewMode === "list",
          }
        )}
      >
        {filteredFiles?.map((file, i) => (viewMode === "grid" ? (<GitHubFileGridCard
          key={i}
          file={file}
          isAnySelected={selectedFiles.length > 0}
          isSelected={selectedFiles.includes(file.name)}
          onSelectionChange={(selected) => {
            if (selected) {
              setSelectedFiles([...selectedFiles, file.name]);
            } else {
              setSelectedFiles(selectedFiles.filter(f => f !== file.name));
            }
          }}
          onView={async (url) => setImagePreview({url, name: file.name})}
          onDownload={onDownload}
          onDelete={onDelete}
        />) : (<GitHubFileListCard
          key={i}
          file={file}
          isAnySelected={selectedFiles.length > 0}
          isSelected={selectedFiles.includes(file.name)}
          onSelectionChange={(selected) => {
            if (selected) {
              setSelectedFiles([...selectedFiles, file.name]);
            } else {
              setSelectedFiles(selectedFiles.filter(f => f !== file.name));
            }
          }}
          onView={async (url) => setImagePreview({url, name: file.name})}
          onDownload={onDownload}
          onDelete={onDelete}
        />)))}
      </div>
      {imagePreview && <ImageLightbox
        open={true}
        onOpenChange={(open) => {
          if (!open) {
            setImagePreview(null);
          }
        }}
        src={imagePreview.url}
        name={imagePreview.name}
      />}
    </div>
  );
}

export default GitHubFileManager;
