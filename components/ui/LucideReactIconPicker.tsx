"use client";

import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { ChevronsUpDown, Search } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fuzzySearch } from "@/lib/fuzzySearch";
import { cn } from "@/lib/utils";

type PickerIconName = keyof typeof Icons.icons;

type LucideReactIconPickerProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "onChange" | "type" | "value" | "variant"
> & {
  emptyLabel?: string;
  onChange: (value: string) => void;
  value?: string;
};

function isLucideIcon(icon: unknown): icon is LucideIcon {
  return typeof icon === "object" && icon !== null && "$$typeof" in icon;
}

const iconOptions = (Object.keys(Icons.icons) as PickerIconName[]).sort(
  (first, second) => first.localeCompare(second),
);

function LucideReactIconPicker({
  className,
  emptyLabel = "No icon selected",
  onChange,
  value,
  ...props
}: LucideReactIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedIcon =
    value && Object.hasOwn(Icons, value)
      // biome-ignore lint/performance/noDynamicNamespaceImportAccess: We need to dynamically access the icon component based on the value prop
      ? Icons[value as keyof typeof Icons]
      : undefined;
  const SelectedIcon = isLucideIcon(selectedIcon) ? selectedIcon : undefined;
  const selectedIconName = SelectedIcon ? value : undefined;

  const matchingIcons = useMemo(() => {
    return fuzzySearch(iconOptions, query, (name) => name);
  }, [query]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  }

  function handleSelect(iconName: PickerIconName) {
    onChange(iconName);
    handleOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            {...props}
            type="button"
            variant="outline"
            title={value ? `Change ${value} icon` : "Choose a Lucide icon"}
            aria-label={
              value ? `Change icon, currently ${value}` : "Choose a Lucide icon"
            }
            className={cn(
              "w-full justify-between gap-2 text-left font-normal cursor-pointer hover:-translate-y-px",
              className,
            )}
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon ? (
            <SelectedIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <span className="size-4 shrink-0" />
          )}
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selectedIconName ||
              (!value ? emptyLabel : `Unknown icon: ${value}`)}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          {value ? "Change" : "Choose"}
          <ChevronsUpDown className="size-3.5" />
        </span>
      </PopoverTrigger>
      {open && (
        <PopoverContent
          align="start"
          className="w-80 max-w-[calc(100vw-2rem)] gap-2 p-2"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              aria-label="Search Lucide icons"
              placeholder="Search icons by name..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 pl-8"
            />
          </div>

          {matchingIcons.length > 0 ? (
            <div className="grid max-h-64 grid-cols-6 gap-1 overflow-y-auto pr-1">
              {matchingIcons.map((name) => {
                const Icon = Icons.icons[name];

                return (
                  <Button
                    key={name}
                    type="button"
                    variant={value === name ? "secondary" : "ghost"}
                    aria-label={`Select ${name}`}
                    aria-pressed={value === name}
                    title={name}
                    onClick={() => handleSelect(name)}
                    className="h-12 min-w-0 flex-col gap-1 overflow-hidden px-1 py-1 cursor-pointer hover:-translate-y-px"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="w-full truncate text-center text-[9px] leading-3">
                      {name}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No icons match “{query}”.
            </p>
          )}

          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {matchingIcons.length.toLocaleString()} icons
            </span>
            {value && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  onChange("");
                  handleOpenChange(false);
                }}
                className="h-7 cursor-pointer hover:-translate-y-px"
              >
                Clear selection
              </Button>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

export { LucideReactIconPicker };
