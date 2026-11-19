import { Check, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GitHubContent } from "@/lib/gitHub";
import { cn } from "@/lib/utils";

export default function GithubFilePickerCard({
  file,
  onSelect,
  isSelected,
}: {
  file: GitHubContent;
  onSelect: (file: GitHubContent) => void;
  isSelected: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" delay={2000}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border p-2 transition-all duration-150",
            isSelected
              ? "border-ring bg-ring/10 opacity-60 cursor-default"
              : "cursor-pointer hover:bg-muted hover:shadow-sm",
          )}
          onClick={() => {
            if (!isSelected) {
              onSelect(file);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Select ${file.name}`}
          aria-pressed={isSelected}
          onKeyDown={(e) => {
            if (!isSelected && (e.key === "Enter" || e.key === " ")) {
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
            className={cn(
              "shrink-0",
              isSelected
                ? "cursor-default"
                : "cursor-pointer hover:-translate-y-px",
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!isSelected) {
                onSelect(file);
              }
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
