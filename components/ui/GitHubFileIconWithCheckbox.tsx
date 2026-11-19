"use client"

import {useState, useEffect, useRef} from 'react';
import {FileIcon} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {GitHubContent} from "@/lib/gitHub";
import {getFileTypeFromExtension} from "@/lib/files";
import {UPLOADS_PATH, UPLOADS_THUMBS_PATH} from "@/lib/pathConfig";
import Image from "next/image";

export default function GitHubFileIconWithCheckbox(
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
  const prevThumbnailRef = useRef(thumbnailUrl);

  useEffect(() => {
    if (thumbnailUrl !== prevThumbnailRef.current) {
      setImageUrl(thumbnailUrl);
      prevThumbnailRef.current = thumbnailUrl;
    }
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
