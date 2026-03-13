"use client";

import * as React from "react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

function Select({
  options = [],
  selected,
  setSelected,
  placeholder = "Select option",
  isMulti = false,
}) {
  const [open, setOpen] = useState(false);

  const isSelected = (value) =>
    isMulti
      ? Array.isArray(selected) && selected.includes(value)
      : selected === value;

  const handleSelect = (option) => {
    if (isMulti) {
      const current = Array.isArray(selected) ? selected : [];

      if (current.includes(option.value)) {
        setSelected(current.filter((v) => v !== option.value));
      } else {
        setSelected([...current, option.value]);
      }
    } else {
      setSelected(option.value);
      setOpen(false);
    }
  };

  const handleRemove = (value) => {
    if (!isMulti) return;
    setSelected((prev) => prev.filter((v) => v !== value));
  };

  const handleClearAll = () => {
    setSelected(isMulti ? [] : null);
  };

  const getSelectedLabel = () => {
    if (isMulti) {
      if (!Array.isArray(selected) || selected.length === 0)
        return placeholder;

      return selected.map((value) => {
        const option = options.find((o) => o.value === value);
        if (!option) return null;

        return (
          <Badge key={value} className="mr-2">
            {option.label}
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(value);
              }}
            >
              <XIcon className="ml-2 h-4 w-4 cursor-pointer" />
            </span>
          </Badge>
        );
      });
    }

    const option = options.find((o) => o.value === selected);
    return option?.label || placeholder;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between dark:bg-card"
        >
          <div className="flex flex-wrap gap-1">
            {getSelectedLabel()}
          </div>

          <div className="flex items-center gap-2">
            {(isMulti
              ? Array.isArray(selected) && selected.length > 0
              : selected) && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              >
                <XIcon className="h-4 w-4 shrink-0 opacity-50" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      isSelected(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Select;