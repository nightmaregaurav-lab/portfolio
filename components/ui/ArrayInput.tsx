"use client"

import React, {useState} from "react";
import {Input as InputPrimitive} from "@base-ui/react/input";
import {XIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import SmartLink from "@/components/ui/SmartLink";
import {fuzzySearch} from "@/lib/fuzzySearch";
import {Button} from "@/components/ui/button";

type ArrayInputProps = Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value: string[] | undefined;
  onChange?: (value: string[] | undefined) => void;
  suggestions?: readonly string[];
  onValueAdded?: (value: string) => void;
};

function isLink(value: string) {
  return /^https?:\/\//i.test(value);
}

function ArrayInput({className, value, onChange, suggestions = [], onValueAdded, ...props}: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const filteredSuggestions = inputValue.trim()
    ? fuzzySearch(
        suggestions.filter((suggestion) =>
          !(value || []).some((item) => item.toLocaleLowerCase() === suggestion.toLocaleLowerCase())
        ),
        inputValue,
        (suggestion) => suggestion
      ).slice(0, 6)
    : [];

  function addValue(valueToAdd = inputValue) {
    const nextValue = valueToAdd.trim();
    if (!nextValue) return;

    onValueAdded?.(nextValue);
    if (!(value || []).some((item) => item.toLocaleLowerCase() === nextValue.toLocaleLowerCase())) {
      onChange?.([...(value || []), nextValue]);
    }
    setInputValue("");
    setActiveSuggestionIndex(-1);
  }

  function removeValue(index: number) {
    onChange?.((value || []).filter((_, valueIndex) => valueIndex !== index));
  }

  return (
    <div className={"grid gap-2"}>
      <div className={"relative"}>
        <InputPrimitive
          {...props}
          type={"text"}
          value={inputValue}
          autoComplete={suggestions.length ? "off" : props.autoComplete}
          aria-autocomplete={suggestions.length ? "list" : undefined}
          aria-expanded={filteredSuggestions.length > 0}
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          onChange={(event) => {
            setInputValue(event.target.value);
            setActiveSuggestionIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && filteredSuggestions.length > 0) {
              event.preventDefault();
              setActiveSuggestionIndex((index) => (index + 1) % filteredSuggestions.length);
              return;
            }

            if (event.key === "ArrowUp" && filteredSuggestions.length > 0) {
              event.preventDefault();
              setActiveSuggestionIndex((index) => index <= 0 ? filteredSuggestions.length - 1 : index - 1);
              return;
            }

            if (event.key === "Enter") {
              event.preventDefault();
              const exactSuggestion = filteredSuggestions.find((suggestion) =>
                suggestion.toLocaleLowerCase() === inputValue.trim().toLocaleLowerCase()
              );
              addValue((activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) || exactSuggestion || inputValue);
            }

            if (event.key === "Escape") {
              setInputValue("");
              setActiveSuggestionIndex(-1);
            }
          }}
        />
        {filteredSuggestions.length > 0 && (
          <div className={"absolute inset-x-0 top-full z-50 mt-1 max-h-48 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"} role={"listbox"}>
            {filteredSuggestions.map((suggestion, index) => (
              <Button
                key={suggestion}
                type={"button"}
                variant={"ghost"}
                size={"sm"}
                role={"option"}
                aria-selected={index === activeSuggestionIndex}
                className={cn(
                  "h-auto w-full justify-start rounded-sm px-2 py-1.5 text-left text-sm font-normal",
                  index === activeSuggestionIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addValue(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
      {value && value.length > 0 && (
        <div className={"flex flex-wrap gap-2"}>
          {value.map((item, index) => (
            <span key={`${item}-${index}`} className={"inline-flex max-w-full items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"}>
              {isLink(item) ? (
                <SmartLink href={item} target={"_blank"} rel={"noreferrer"} className={"max-w-[18rem] truncate hover:underline"}>
                  {item}
                </SmartLink>
              ) : (
                <span className={"max-w-[18rem] truncate"}>{item}</span>
              )}
              <Button
                type={"button"}
                variant={"ghost"}
                size={"icon-xs"}
                aria-label={`Remove ${item}`}
                className={"ml-1 shrink-0 rounded-sm text-primary-foreground transition-transform hover:scale-110 hover:bg-primary-foreground/20 active:scale-95"}
                onClick={() => removeValue(index)}
              >
                <XIcon size={12} />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export {ArrayInput};
