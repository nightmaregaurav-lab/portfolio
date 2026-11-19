"use client";

import { Checkbox } from "@/components/ui/checkbox";

function CheckboxList({
  id,
  options,
  value,
  onValueChange,
}: {
  id: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string[];
  onValueChange: (value: string[]) => void;
}) {
  return (
    <div className={"grid gap-2 sm:grid-cols-2"} id={id}>
      {options.map((option) => (
        <label
          htmlFor={option.value}
          key={option.value}
          className={
            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
          }
        >
          <Checkbox
            checked={value.includes(option.value)}
            onCheckedChange={(checked) =>
              onValueChange(
                checked
                  ? [...value, option.value]
                  : value.filter((item) => item !== option.value),
              )
            }
          />
          <span className={"text-sm font-medium"}>{option.label}</span>
        </label>
      ))}
      {(!options || options.length === 0) && (
        <div className={"text-sm text-muted-foreground"}>
          No options available.
        </div>
      )}
    </div>
  );
}

export default CheckboxList;
