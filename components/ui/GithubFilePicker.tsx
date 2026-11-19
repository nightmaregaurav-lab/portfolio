"use client";

import { Check, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GithubFilePickerCard from "@/components/ui/GithubFilePickerCard";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { useGitHubFolder } from "@/hooks/useGitHubFolder";
import { getFileTypeFromExtension } from "@/lib/files";
import type { GitHubContent } from "@/lib/gitHub";
import { UPLOADS_PATH, UPLOADS_THUMBS_PATH } from "@/lib/pathConfig";
import { cn } from "@/lib/utils";

type GithubFilePickerProps = {
  path?: string;
  onSelect?: (url: string) => void;
  selectedUrls?: string[];
  className?: string;
};

function GithubFilePicker({
  path = UPLOADS_PATH,
  onSelect,
  selectedUrls = [],
  className,
}: GithubFilePickerProps) {
  const {
    state: searchKeyword,
    debouncedState: debouncedSearchKeyword,
    setState: setSearchKeyword,
  } = useDebouncedState("", 500);

  const [imagePreview, setImagePreview] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const { recentUploads, serverFiles, loadingFiles } = useGitHubFolder(path);

  const filteredFiles = serverFiles?.filter((file) =>
    file.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()),
  );

  const filteredRecentUploads = recentUploads?.filter((file) =>
    file.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()),
  );

  const recentImageFiles = filteredRecentUploads?.filter(
    (file) => getFileTypeFromExtension(file.name) === "Image",
  );
  const recentOtherFiles = filteredRecentUploads?.filter(
    (file) => getFileTypeFromExtension(file.name) !== "Image",
  );

  const imageFiles = filteredFiles?.filter(
    (file) => getFileTypeFromExtension(file.name) === "Image",
  );
  const otherFiles = filteredFiles?.filter(
    (file) => getFileTypeFromExtension(file.name) !== "Image",
  );

  function handleSelect(file: GitHubContent) {
    if (selectedUrls.some((url) => url === file.download_url)) {
      return;
    }
    onSelect?.(file.download_url);
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className={"flex flex-col gap-1 mb-3"}>
        <span className={"text-lg font-bold"}>Pick a File</span>
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
        <div
          className={
            "flex flex-row justify-center align-center items-center py-8"
          }
        >
          <Spinner className={"mr-1"} /> Loading...
        </div>
      )}

      {!loadingFiles &&
        (!serverFiles || serverFiles.length === 0) &&
        (!filteredRecentUploads || filteredRecentUploads.length === 0) && (
          <div
            className={
              "flex flex-row justify-center align-center items-center py-8"
            }
          >
            <span className={"text-gray-500"}>No files found.</span>
          </div>
        )}

      {!loadingFiles &&
        serverFiles &&
        serverFiles.length > 0 &&
        filteredFiles &&
        filteredFiles.length === 0 &&
        (!filteredRecentUploads || filteredRecentUploads.length === 0) && (
          <div
            className={
              "flex flex-row justify-center align-center items-center py-8"
            }
          >
            <span className={"text-gray-500"}>
              No files found matching the search criteria.
            </span>
          </div>
        )}

      <div className={"flex flex-col gap-3 overflow-y-auto max-h-64"}>
        {(recentImageFiles && recentImageFiles.length > 0) ||
        (recentOtherFiles && recentOtherFiles.length > 0) ? (
          <>
            <div
              className={
                "flex flex-row justify-between align-center items-center"
              }
            >
              <span className={"text-xs font-semibold text-gray-700"}>
                Recent Uploads
              </span>
              <span className={"text-xs text-gray-500"}>
                syncing with server...
              </span>
            </div>
            {recentImageFiles && recentImageFiles.length > 0 && (
              <div className={"grid grid-cols-3 gap-2"}>
                {recentImageFiles.map((file) => (
                  <PickerImageCard
                    key={`recent-img-${file.name}`}
                    file={file}
                    onSelect={handleSelect}
                    onView={(url) => setImagePreview({ url, name: file.name })}
                    isSelected={selectedUrls.some(
                      (url) => url === file.download_url,
                    )}
                  />
                ))}
              </div>
            )}
            {recentOtherFiles && recentOtherFiles.length > 0 && (
              <div className={"flex flex-col gap-1"}>
                {recentOtherFiles.map((file) => (
                  <GithubFilePickerCard
                    key={`recent-file-${file.name}`}
                    file={file}
                    onSelect={handleSelect}
                    isSelected={selectedUrls.some(
                      (url) => url === file.download_url,
                    )}
                  />
                ))}
              </div>
            )}
            <Separator className={"my-1"} />
          </>
        ) : null}

        {imageFiles && imageFiles.length > 0 && (
          <div className={"flex flex-col gap-2"}>
            <span
              className={
                "text-xs font-medium text-muted-foreground uppercase tracking-wider"
              }
            >
              Images
            </span>
            <div className={"grid grid-cols-3 gap-2"}>
              {imageFiles.map((file) => (
                <PickerImageCard
                  key={file.name}
                  file={file}
                  onSelect={handleSelect}
                  onView={(url) => setImagePreview({ url, name: file.name })}
                  isSelected={selectedUrls.some(
                    (url) => url === file.download_url,
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {otherFiles && otherFiles.length > 0 && (
          <div className={"flex flex-col gap-2"}>
            <span
              className={
                "text-xs font-medium text-muted-foreground uppercase tracking-wider"
              }
            >
              Other Files
            </span>
            <div className={"flex flex-col gap-1"}>
              {otherFiles.map((file) => (
                <GithubFilePickerCard
                  key={file.name}
                  file={file}
                  onSelect={handleSelect}
                  isSelected={selectedUrls.some(
                    (url) => url === file.download_url,
                  )}
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
  onView,
  isSelected,
}: {
  file: GitHubContent;
  onSelect: (file: GitHubContent) => void;
  onView: (url: string) => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const thumbnailUrl =
    file.path.startsWith(`${UPLOADS_PATH}/`) &&
    !file.path.startsWith(`${UPLOADS_THUMBS_PATH}/`)
      ? file.download_url.replace(
          `/${UPLOADS_PATH}/`,
          `/${UPLOADS_THUMBS_PATH}/`,
        )
      : file.download_url;
  const [imageUrl, setImageUrl] = useState(thumbnailUrl);

  return (
    <Tooltip>
      <TooltipTrigger type="button" delay={2000}>
        <fieldset
          className={cn(
            "group relative aspect-square rounded-lg border overflow-hidden transition-all duration-150",
            isSelected
              ? "ring-2 ring-ring border-ring opacity-60 cursor-default"
              : "cursor-pointer hover:scale-[1.02] hover:shadow-md",
            !isSelected && hovered && "ring-2 ring-ring",
          )}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            if (!isSelected) {
              onSelect(file);
            }
          }}
          aria-label={`Select ${file.name}`}
          onKeyDown={(e) => {
            if (!isSelected && (e.key === "Enter" || e.key === " ")) {
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

          {isSelected && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Check
                size={24}
                className="text-white drop-shadow-md"
                aria-hidden="true"
              />
            </div>
          )}

          {!isSelected && hovered && (
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
        </fieldset>
      </TooltipTrigger>
      <TooltipContent side={"bottom"}>
        <p>{file.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default GithubFilePicker;
