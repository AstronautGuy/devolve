"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} />

        {/* Footer */}
        <div className="flex justify-between border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange?.(undefined)}
          >
            Clear
          </Button>

          <Button
            size="sm"
            onClick={() => {
              const today = new Date();
              onChange?.(
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                ),
              );
            }}
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}