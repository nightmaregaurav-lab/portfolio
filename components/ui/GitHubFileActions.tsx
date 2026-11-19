"use client";

import { Copy, Download, Ellipsis, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GitHubContent } from "@/lib/gitHub";

export default function GitHubFileActions({
  file,
  onView,
  onDownload,
  onDelete,
}: {
  file: GitHubContent;
  onView: (url: string) => Promise<void>;
  onDownload?: (fileNames: string[]) => Promise<void>;
  onDelete?: (fileNames: string[]) => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type={"button"}
            size={"icon-sm"}
            variant="outline"
            className="cursor-pointer hover:-translate-y-px"
          >
            <Ellipsis size={16} className="cursor-pointer" />
          </Button>
        }
      />
      <DropdownMenuContent className="w-auto border rounded-md bg-white shadow-lg">
        <DropdownMenuItem
          className="hover:bg-gray-100 py-1 px-4 pt-2 cursor-pointer flex flex-no gap-2"
          onClick={async () => {
            await navigator.clipboard.writeText(file.download_url);
          }}
        >
          <Copy size={14} />
          CopyLink
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2"
          onClick={async () => {
            await onView(file.download_url);
          }}
        >
          <Eye size={14} />
          View
        </DropdownMenuItem>
        {onDownload && (
          <DropdownMenuItem
            className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2"
            onClick={async () => {
              await onDownload([file.name]);
            }}
          >
            <Download size={14} />
            Download
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            className="hover:bg-gray-100 py-1 px-4 cursor-pointer flex flex-no gap-2"
            onClick={async () => {
              await onDelete([file.name]);
            }}
          >
            <Trash size={14} />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
