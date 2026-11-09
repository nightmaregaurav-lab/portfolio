"use client"

import React, {useState, useMemo} from "react";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

const PRESET_COLORS = [
  "#FFFFFF", "#000000", "#EF4444", "#F97316", "#F59E0B", "#EAB308",
  "#84CC16", "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#3B82F6",
  "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E",
];

type ColorPickerProps = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
};

function ColorPicker({value = "#FFFFFF", onChange, className, id}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);

  const isValidHex = useMemo(() => {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
  }, [value]);

  const displayColor = isValidHex ? value : "#FFFFFF";

  function handleHexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) {
      onChange(raw);
    }
  }

  function handlePresetClick(color: string) {
    onChange(color);
    setHexInput(color);
  }

  function handleNativeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const color = e.target.value;
    onChange(color.toUpperCase());
    setHexInput(color.toUpperCase());
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      setHexInput(value);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal cursor-pointer hover:-translate-y-px", className)}
            id={id}
          >
            <div
              className="w-5 h-5 rounded border border-border shrink-0 mr-2"
              style={{backgroundColor: displayColor}}
            />
            <span className="truncate font-mono text-sm">{displayColor}</span>
          </Button>
        }
      />
      <PopoverContent className="w-64 p-3">
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Color</Label>
            <div className="flex gap-2">
              <div className="relative w-10 h-10 rounded-lg border overflow-hidden shrink-0">
                <input
                  type="color"
                  value={displayColor}
                  onChange={handleNativeChange}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0"
                  aria-label="Pick color"
                />
              </div>
              <Input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#FFFFFF"
                className="font-mono"
                maxLength={7}
                aria-label="Hex color code"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Presets</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className={cn(
                    "w-8 h-8 rounded-md border border-border transition-shadow hover:shadow-md",
                    value.toUpperCase() === color && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{backgroundColor: color}}
                  aria-label={`Select ${color}`}
                  title={color}
                >
                  {value.toUpperCase() === color && (
                    <Check size={14} className="m-auto" style={{color: color === "#FFFFFF" ? "#000000" : "#FFFFFF"}} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export {ColorPicker};
