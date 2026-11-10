"use client"

import React, {useEffect, useState} from 'react';
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Copy, Download, Ellipsis, Eye, FileIcon, Grid, List, Trash} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {Separator} from "@/components/ui/separator";
import {useGitHubFolder} from "@/hooks/useGitHubFolder";
import {Input} from "@/components/ui/input";
import {useDebouncedState} from "@/hooks/useDebouncedState";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {GitHubContent} from "@/lib/gitHub";
import Image from "next/image";
import {Checkbox} from "@/components/ui/checkbox";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {getFileTypeFromExtension, humanizeFileSize} from "@/lib/files";
import {UPLOADS_PATH, UPLOADS_THUMBS_PATH} from "@/lib/pathConfig";
import FileUploadButton from "@/components/ui/FileUploadButton";
import {confirm} from "@/components/ui/Confirm";
import ImageLightbox from "@/components/ui/ImageLightbox";

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
    let returned = await confirm({
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
            {filteredRecentUploads.map((file, i) => (viewMode === "grid" ? (<GridCard
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
            />) : (<ListCard
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
        {filteredFiles?.map((file, i) => (viewMode === "grid" ? (<GridCard
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
        />) : (<ListCard
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

function GridCard(
  {file, isAnySelected, isSelected, onSelectionChange, onView, onDownload, onDelete}: {
    file: GitHubContent,
    isAnySelected: boolean,
    isSelected: boolean,
    onSelectionChange: (selected: boolean) => void,
    onView: (url: string) => Promise<void>,
    onDownload?: (fileNames: string[]) => Promise<void>,
    onDelete?: (fileNames: string[]) => Promise<void>
  }
) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" delay={2000}>
        <div className={cn(
          "rounded p-2 flex flex-col align-center",
          {
            "border": !isSelected,
            "border-2": isSelected,
          }
        )}>
          <div className={"flex flex-row align-center items-center"}>
            <FileIconWithCheckbox
              file={file}
              isAnySelected={isAnySelected}
              isSelected={isSelected}
              onSelectionChange={onSelectionChange}
            />
            <div className="flex min-w-0 grow mx-1">
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {file.name.slice(0, file.name.lastIndexOf("."))}
              </span>
              <span className="shrink-0 whitespace-nowrap">
                .{file.name.slice(file.name.lastIndexOf(".") + 1)}
              </span>
            </div>
            <FileActions file={file} onView={onView} onDownload={onDownload} onDelete={onDelete} />
          </div>
          <span className={"flex flex-row gap-2 justify-between mt-1 text-muted-foreground text-xs"}>
            <span>{humanizeFileSize(file.size)}</span>
            <span>{getFileTypeFromExtension(file.name)}</span>
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side={"bottom"}>
        <p>{file.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ListCard(
  {file, isAnySelected, isSelected, onSelectionChange, onView, onDownload, onDelete}: {
    file: GitHubContent,
    isAnySelected: boolean,
    isSelected: boolean,
    onSelectionChange: (selected: boolean) => void,
    onView: (url: string) => Promise<void>,
    onDownload?: (fileNames: string[]) => Promise<void>,
    onDelete?: (fileNames: string[]) => Promise<void>
  }
) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" delay={2000}>
        <div className={cn(
          "rounded p-2 flex flex-row align-center items-center",
          {
            "border": !isSelected,
            "border-2": isSelected,
          }
        )}>
          <FileIconWithCheckbox
            file={file}
            isAnySelected={isAnySelected}
            isSelected={isSelected}
            onSelectionChange={onSelectionChange}
          />
          <div className="flex min-w-0 flex-col grow mx-1">
            <div className="flex min-w-0 grow mx-1">
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {file.name.slice(0, file.name.lastIndexOf("."))}
              </span>
              <span className="shrink-0 whitespace-nowrap">
                .{file.name.slice(file.name.lastIndexOf(".") + 1)}
              </span>
            </div>
            <div className={"flex flex-row mx-1 gap-1 justify-start text-muted-foreground text-xs"}>
              <span>{humanizeFileSize(file.size)}</span>
              <span>•</span>
              <span>{getFileTypeFromExtension(file.name)}</span>
            </div>
          </div>
          <FileActions
            file={file}
            onView={onView}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side={"bottom"}>
        <p>{file.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function FileActions(
  {file, onView, onDownload, onDelete}: {
    file: GitHubContent,
    onView: (url: string) => Promise<void>,
    onDownload?: (fileNames: string[]) => Promise<void>,
    onDelete?: (fileNames: string[]) => Promise<void>
  }
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type={"button"} size={"icon-sm"} variant="outline" className="cursor-pointer hover:-translate-y-px">
        <Ellipsis size={16} className="cursor-pointer" />
      </Button>} />
      <DropdownMenuContent className="w-auto border rounded-md bg-white shadow-lg">
        <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 pt-2 cursor-pointer flex flex-no gap-2" onClick={async () => {
          await navigator.clipboard.writeText(file.download_url);
        }}>
          <Copy size={14} />
          CopyLink
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2" onClick={async () => {
          await onView(file.download_url);
        }}>
          <Eye size={14} />
          View
        </DropdownMenuItem>
        {onDownload && <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2" onClick={async () => {
          await onDownload([file.name]);
        }}>
          <Download size={14} />
          Download
        </DropdownMenuItem>}
        {onDelete && <DropdownMenuItem className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2" onClick={async () => {
          await onDelete([file.name]);
        }}>
          <Trash size={14} />
          Delete
        </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FileIconWithCheckbox(
  {file, isAnySelected, isSelected, onSelectionChange, size=40}: {
    file: GitHubContent;
    isAnySelected: boolean;
    isSelected: boolean;
    onSelectionChange: (selected: boolean) => void;
    size?: number;
  }
) {
  const [hovered, setHovered] = useState(false);
  const showCheckbox = hovered || isAnySelected;

  const isImage = getFileTypeFromExtension(file.name) === "Image";
  const thumbnailUrl = isImage && file.path.startsWith(`${UPLOADS_PATH}/`) && !file.path.startsWith(`${UPLOADS_THUMBS_PATH}/`)
    ? file.download_url.replace(`/${UPLOADS_PATH}/`, `/${UPLOADS_THUMBS_PATH}/`)
    : file.download_url;
  const [imageUrl, setImageUrl] = useState(thumbnailUrl);

  useEffect(() => {
    setImageUrl(thumbnailUrl);
  }, [thumbnailUrl]);

  return <span
    className="relative inline-flex shrink-0 cursor-pointer items-center justify-center transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
    style={{
      width: `${size}px`,
      height: `${size}px`,
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onClick={() => onSelectionChange(!isSelected)}
  >
    {isImage ? (
      <Image
        src={imageUrl}
        alt={file.name}
        width={size}
        height={size}
        className="block h-full w-full rounded object-cover"
        loading="lazy"
        onError={() => {
          if (imageUrl !== file.download_url) {
            setImageUrl(file.download_url);
          }
        }}
      />
    ) : (
      <FileIcon
        aria-hidden="true"
        className="block h-full w-full"
      />
    )}

    {showCheckbox && (
      <Checkbox
        checked={isSelected}
        aria-label={`Select ${file.name}`}
        className="absolute left-1 top-1 z-10 m-0 cursor-pointer h-3 w-3"
      />
    )}
  </span>;
}
