"use client";

import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
  type UseControllerProps,
  type UseFormReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface FormYearFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  disabled?: boolean;
  message?: string;
  onChange?: (value: string) => void;
  startYear?: number;
  endYear?: number;
  disablePast?: boolean;
  disableFuture?: boolean;
  size?: "sm" | "md" | "lg";
}

// Add type declaration for the years array
const generateYearRange = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push({
      value: year.toString(),
      label: year.toString(),
    });
  }
  return years;
};

const FormYearField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  disabled = false,
  message,
  onChange,
  startYear,
  endYear,
  disablePast = false,
  disableFuture = false,
  size = "md",
}: FormYearFieldProps<T>) => {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // Calculate year ranges
  const defaultRange = 50;
  const calculatedStartYear = startYear ?? currentYear - defaultRange;
  const calculatedEndYear = endYear ?? currentYear + defaultRange;

  // Apply past/future constraints
  const finalStartYear = disablePast ? currentYear : calculatedStartYear;
  const finalEndYear = disableFuture ? currentYear : calculatedEndYear;

  const years = generateYearRange(finalStartYear, finalEndYear);
  const selectedYear = form.watch(name);
  const scrollToYear = selectedYear || currentYear.toString();

  return (
    <Controller
      render={() => (
        <FormField
          name={name}
          control={form.control as Control<T>}
          render={() => (
            <FormItem className={cn(size === "sm" && "space-y-0.5")}>
              <FormLabel className={cn(size === "sm" && "text-xs")}>
                {formLabel}
              </FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={disabled}
                      className={cn(
                        "w-full justify-between",
                        !selectedYear && "text-muted-foreground",
                        size === "sm" && "h-8 text-xs"
                      )}
                    >
                      {selectedYear || formLabel}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search year..." />
                    <CommandEmpty>No year found.</CommandEmpty>
                    <ScrollArea
                      className="h-[200px]"
                      onLoad={(e: React.UIEvent<HTMLDivElement>) => {
                        // Scroll to selected/current year on open
                        const target = e.currentTarget;
                        const element = target.querySelector(
                          `[data-value="${scrollToYear}"]`
                        );
                        if (element) {
                          element.scrollIntoView({ block: "center" });
                        }
                      }}
                    >
                      <CommandGroup>
                        {years.map((year) => (
                          <CommandItem
                            key={year.value}
                            value={year.value}
                            onSelect={() => {
                              form.setValue(
                                name,
                                year.value as PathValue<T, Path<T>>
                              );
                              onChange?.(year.value);
                              setOpen(false);
                            }}
                            className="justify-between"
                            data-value={year.value}
                          >
                            {year.label}
                            <Check
                              className={cn(
                                "ml-2 size-4",
                                selectedYear === year.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              {message && <FormDescription>{message}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      name={name}
      control={control}
    />
  );
};

// Make sure to export the component as default
export default FormYearField;
