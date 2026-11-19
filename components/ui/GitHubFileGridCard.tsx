import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {GitHubContent} from "@/lib/gitHub";
import {getFileTypeFromExtension, humanizeFileSize} from "@/lib/files";
import FileIconWithCheckbox from "@/components/ui/GitHubFileIconWithCheckbox";
import FileActions from "@/components/ui/GitHubFileActions";

export default function GitHubFileGridCard(
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
