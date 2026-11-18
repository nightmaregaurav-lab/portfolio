"use client"

import React from "react";
import {format, isValid, parseISO} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";

type DatePickerProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onChange" | "type" | "value" | "variant"
> & {
  value?: string;
  onChange: (value: string) => void;
};

function DatePicker({className, value, onChange, ...props}: DatePickerProps) {
  const parsedDate = value ? parseISO(value) : undefined;
  const date = parsedDate && isValid(parsedDate) ? parsedDate : undefined;
  const currentYear = new Date().getFullYear();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            {...props}
            type="button"
            variant="outline"
            data-empty={!date}
            className={cn(
              "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground cursor-pointer hover:-translate-y-px",
              className
            )}
          />
        }
      >
        <CalendarIcon />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          startMonth={new Date(currentYear - 100, 0)}
          endMonth={new Date(currentYear + 100, 11)}
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(selectedDate) =>
            onChange(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "")
          }
        />
      </PopoverContent>
    </Popover>
  );
}

export {DatePicker};
