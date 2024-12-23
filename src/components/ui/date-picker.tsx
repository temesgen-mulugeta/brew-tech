import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  startYear?: number;
  endYear?: number;
  disableFuture?: boolean;
  disablePast?: boolean;
  disabledDays?: Date[];
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder,
  startYear,
  endYear,
  disableFuture,
  disabledDays,
  disablePast,
  required = false,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal relative group",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
          <div className="ml-auto flex items-center gap-2">
            {value && !disabled && (
              <div
                className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
              >
                <XIcon className="h-3 w-3" />
              </div>
            )}
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          startYear={startYear}
          endYear={endYear}
          selectedDate={value}
          onDateChange={(date) => {
            onChange(date);
            setOpen(false);
          }}
          initialFocus
          disableFuture={disableFuture}
          disabledDays={disabledDays}
          disablePast={disablePast}
          required={required}
          minDate={minDate}
          maxDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
}
