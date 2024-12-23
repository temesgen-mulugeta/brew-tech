"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CaptionProps, DayPicker, Matcher, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { getTomorrow } from "@/lib/misc/helpers";

export type CalendarProps = {
  startYear?: number;
  endYear?: number;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  disableFuture?: boolean;
  disabledDays?: Date[];
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
} & React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  startYear,
  endYear,
  onDateChange,
  selectedDate,
  disableFuture,
  disabledDays,
  minDate,
  maxDate,
  disablePast,
  ...props
}: CalendarProps) {
  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    selectedDate
  );

  const [month, setMonth] = useState<Date>(selectedDate ?? currentDate);

  const onSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDay(date);
      onDateChange?.(date);
    }
  };

  const getDisabledDates = () => {
    const disabled = [...(disabledDays ? disabledDays : [])] as Matcher[];

    if (disableFuture) {
      disabled.push({
        from: getTomorrow(),
        to: new Date(currentDate.getFullYear() + 100, 4, 29),
      });
    }

    if (disablePast) {
      disabled.push({
        from: new Date(0),
        to: new Date(new Date().setHours(0, 0, 0, 0) - 86400000),
      });
    }

    if (minDate) {
      disabled.push({
        from: new Date(0),
        to: new Date(new Date(minDate).setHours(0, 0, 0, 0) - 86400000),
      });
    }

    if (maxDate) {
      disabled.push({
        from: new Date(new Date(maxDate).setHours(0, 0, 0, 0) + 86400000),
        to: new Date(currentDate.getFullYear() + 100, 11, 31),
      });
    }

    return disabled;
  };

  return (
    <DayPicker
      {...props}
      mode="single"
      selected={selectedDay}
      onSelect={onSelect}
      showOutsideDays={showOutsideDays}
      month={month}
      disabled={getDisabledDates()}
      onMonthChange={setMonth}
      captionLayout="dropdown-buttons"
      fromYear={startYear ?? new Date().getFullYear() - 100}
      toYear={endYear ?? new Date().getFullYear() + 100}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: (cap) => (
          <CustomCaption
            caption={cap}
            date={month}
            setDate={setMonth}
            fromYear={startYear ?? new Date().getFullYear() - 100}
            toYear={endYear ?? new Date().getFullYear() + 100}
          />
        ),
        IconLeft: ({}) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({}) => <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

interface MonthDropdownProps {
  date: Date;
  onChange: (month: number) => void;
}

const MonthDropdown: React.FC<MonthDropdownProps> = ({ date, onChange }) => {
  const months = Array.from({ length: 12 }, (_, index) =>
    format(new Date(0, index), "MMMM")
  );

  return (
    <Select
      value={date instanceof Date ? date.getMonth().toString() : undefined}
      onValueChange={(e) => onChange(parseInt(e))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month, index) => (
          <SelectItem key={month} value={index.toString()}>
            {month.substring(0, 3)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Define props for YearDropdown
interface YearDropdownProps {
  year: number;
  onChange: (year: number) => void;
  fromYear: number;
  toYear: number;
}

export const YearDropdown: React.FC<YearDropdownProps> = ({
  year,
  onChange,
  fromYear,
  toYear,
}) => {
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, index) => fromYear + index
  );

  return (
    <Select
      value={year.toString()}
      onValueChange={(e) => onChange(parseInt(e))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

type CustomCaptionProps = {
  caption: CaptionProps;
  date: Date;
  setDate: (date: Date) => void;
  fromYear: number;
  toYear: number;
};

// CustomCaption component with typed props
const CustomCaption = ({
  date,
  setDate,
  fromYear,
  toYear,
}: CustomCaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const handleMonthChange = (month: number) => {
    const newDate = new Date(date);
    newDate.setMonth(month);
    setDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    setDate(newDate);
  };

  return (
    <div className="grid w-[250px] grid-cols-8 gap-1">
      <Button
        variant="outline"
        className=" h-full px-1 py-1"
        disabled={
          date &&
          date instanceof Date &&
          date.getFullYear() === fromYear &&
          !previousMonth
        }
        onClick={() => {
          if (previousMonth) {
            goToMonth(previousMonth);
          } else {
            handleYearChange(date.getFullYear() - 1);
          }
        }}
      >
        <ChevronLeft className="w-4" />
      </Button>
      <div className="col-span-3">
        <MonthDropdown date={date} onChange={handleMonthChange} />
      </div>
      <div className="col-span-3">
        <YearDropdown
          year={
            date && date instanceof Date
              ? date.getFullYear()
              : new Date().getFullYear()
          }
          onChange={handleYearChange}
          fromYear={fromYear}
          toYear={toYear}
        />
      </div>

      <Button
        variant="outline"
        className=" h-full px-1 py-1"
        disabled={
          date &&
          date instanceof Date &&
          date.getFullYear() === toYear &&
          !nextMonth
        }
        onClick={() => {
          if (nextMonth) {
            goToMonth(nextMonth);
          } else {
            handleYearChange(date.getFullYear() + 1);
          }
        }}
      >
        <ChevronRight className="w-4" />
      </Button>
    </div>
  );
};
