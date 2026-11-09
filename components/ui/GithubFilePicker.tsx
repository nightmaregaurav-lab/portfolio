"use client"

import React, {useState} from 'react';
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Check, Eye, FileIcon} from "lucide-react";
import {Spinner} from "@/components/ui/spinner";
import {useGitHubFolder} from "@/hooks/useGitHubFolder";
import {Input} from "@/components/ui/input";
import {useDebouncedState} from "@/hooks/useDebouncedState";
import {GitHubContent} from "@/lib/gitHub";
import {getFileTypeFromExtension} from "@/lib/files";
import {UPLOADS_PATH, UPLOADS_THUMBS_PATH} from "@/lib/pathConfig";
import Image from "next/image";
import ImageLightbox from "@/components/ui/ImageLightbox";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

type GithubFilePickerProps = {
  path?: string;
  onSelect?: (url: string) => void;
  className?: string;
};

function GithubFilePicker({
  path = UPLOADS_PATH,
  onSelect,
  className
}: GithubFilePickerProps) {
  const {
    state: searchKeyword,
    debouncedState: debouncedSearchKeyword,
    setState: setSearchKeyword
  } = useDebouncedState("", 500);

  const [imagePreview, setImagePreview] = useState<{url: string, name: string} | null>(null);
  const {files, loadingFiles} = useGitHubFolder(path);

  const filteredFiles = files?.filter(file =>
    file.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
  );

  const imageFiles = filteredFiles?.filter(file => getFileTypeFromExtension(file.name) === "Image");
  const otherFiles = filteredFiles?.filter(file => getFileTypeFromExtension(file.name) !== "Image");

  function handleSelect(file: GitHubContent) {
    onSelect?.(file.download_url);
  }


  return (
    <div className={cn("flex flex-col", className)}>
      <div className={"flex flex-col gap-1 mb-3"}>
        <span className={"text-lg font-bold"}>
          Pick a File
        </span>
        <span className={"text-sm text-gray-500"}>
          Click a file or the check mark to select it.
        </span>
      </div>

      <Input
        placeholder={"Search files..."}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className={"mb-3"}
      />

      {loadingFiles && (
        <div className={"flex flex-row justify-center align-center items-center py-8"}>
          <Spinner className={"mr-1"}/> Loading...
        </div>
      )}

      {!loadingFiles && (!files || files.length === 0) && (
        <div className={"flex flex-row justify-center align-center items-center py-8"}>
          <span className={"text-gray-500"}>No files found.</span>
        </div>
      )}

      {!loadingFiles && files && files.length > 0 && filteredFiles && filteredFiles.length === 0 && (
        <div className={"flex flex-row justify-center align-center items-center py-8"}>
          <span className={"text-gray-500"}>No files found matching the search criteria.</span>
        </div>
      )}

      <div className={"flex flex-col gap-3 overflow-y-auto max-h-64"}>
        {imageFiles && imageFiles.length > 0 && (
          <div className={"flex flex-col gap-2"}>
            <span className={"text-xs font-medium text-muted-foreground uppercase tracking-wider"}>Images</span>
            <div className={"grid grid-cols-3 gap-2"}>
              {imageFiles.map((file, i) => (
                <PickerImageCard
                  key={i}
                  file={file}
                  onSelect={handleSelect}
                  onView={(url) => setImagePreview({url, name: file.name})}
                />
              ))}
            </div>
          </div>
        )}

        {otherFiles && otherFiles.length > 0 && (
          <div className={"flex flex-col gap-2"}>
            <span className={"text-xs font-medium text-muted-foreground uppercase tracking-wider"}>Other Files</span>
            <div className={"flex flex-col gap-1"}>
              {otherFiles.map((file, i) => (
                <PickerFileCard
                  key={i}
                  file={file}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {imagePreview && (
        <ImageLightbox
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setImagePreview(null);
            }
          }}
          src={imagePreview.url}
          name={imagePreview.name}
        />
      )}
    </div>
  );
}

function PickerImageCard({
  file,
  onSelect,
  onView
}: {
  file: GitHubContent;
  onSelect: (file: GitHubContent) => void;
  onView: (url: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const thumbnailUrl = file.path.startsWith(`${UPLOADS_PATH}/`) && !file.path.startsWith(`${UPLOADS_THUMBS_PATH}/`)
    ? file.download_url.replace(`/${UPLOADS_PATH}/`, `/${UPLOADS_THUMBS_PATH}/`)
    : file.download_url;
  const [imageUrl, setImageUrl] = useState(thumbnailUrl);

  return (
    <Tooltip>
      <TooltipTrigger type="button" delay={2000}>
        <div
          className={cn(
            "group relative aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md",
            hovered && "ring-2 ring-ring"
          )}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onSelect(file)}
          role="button"
          tabIndex={0}
          aria-label={`Select ${file.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(file);
            }
          }}
        >
          <Image
            src={imageUrl}
            alt={file.name}
            fill
            className="object-cover"
            loading="lazy"
            onError={() => {
              if (imageUrl !== file.download_url) {
                setImageUrl(file.download_url);
              }
            }}
          />

          {hovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1">
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                className="cursor-pointer hover:-translate-y-px"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(file.download_url);
                }}
                aria-label={`Enlarge ${file.name}`}
              >
                <Eye size={12} aria-hidden="true" />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                className="cursor-pointer hover:-translate-y-px"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(file);
                }}
                aria-label={`Select ${file.name}`}
              >
                <Check size={12} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side={"bottom"}>
        <p>{file.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function PickerFileCard({
  file,
  onSelect
}: {
  file: GitHubContent;
  onSelect: (file: GitHubContent) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" delay={2000}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all duration-150 hover:bg-muted hover:shadow-sm"
          )}
          onClick={() => onSelect(file)}
          role="button"
          tabIndex={0}
          aria-label={`Select ${file.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(file);
            }
          }}
        >
          <FileIcon className="shrink-0 text-muted-foreground" size={16} />
          <div className="flex min-w-0 grow">
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              {file.name}
            </span>
          </div>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="shrink-0 cursor-pointer hover:-translate-y-px"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(file);
            }}
            aria-label={`Select ${file.name}`}
          >
            <Check size={12} aria-hidden="true" />
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side={"bottom"}>
        <p>{file.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default GithubFilePicker;
