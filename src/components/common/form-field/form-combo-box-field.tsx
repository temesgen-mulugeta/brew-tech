"use client";
import { useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
  type UseControllerProps,
  type UseFormReturn,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

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

interface FormComboboxFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  options: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
  message?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
}

const FormComboboxField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  options,
  disabled = false,
  message,
  onChange,
}: FormComboboxFieldProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField
          key={JSON.stringify(form.formState)}
          name={name}
          control={form.control as Control<T>}
          render={() => (
            <FormItem>
              <FormLabel>{formLabel}</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      onClick={() => setOpen((prev) => !prev)}
                      variant="outline"
                      role="combobox"
                      disabled={disabled}
                      className={cn(
                        "flex w-full justify-between truncate text-left",
                        !field.value && "text-muted-foreground"
                      )}
                      
                    >
                      {field.value
                        ? options.find((option) => option.value === field.value)
                            ?.label
                        : formLabel}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] break-words p-0"
                  sideOffset={4}
                  // style={{ width: 'var(--radix-popover-trigger-width)' }}
                >
                  <Command className="w-full">
                    <CommandInput
                      placeholder={`Search...`}
                      className="w-full"
                    />
                    <CommandEmpty>No Item Found.</CommandEmpty>
                    <ScrollArea className="h-40  ">
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            value={option.label}
                            key={option.value}
                            disabled={option.disabled}
                            className={
                              option.disabled ? "bg-grey-200 text-grey-600" : ""
                            }
                            onSelect={() => {
                              onChange?.(option.value);
                              setOpen(false);
                              field.onChange(option.value as PathValue<T, Path<T>>);
                              form.setValue(
                                name,
                                option.value as PathValue<T, Path<T>>
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                option.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <p className="w-full">{option.label}</p>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              {message && <FormDescription>{message}</FormDescription>}
              <FormMessage>
                {form.formState.errors[name]?.message as string}
              </FormMessage>
            </FormItem>
          )}
        />
      )}
    />
  );
};

export default FormComboboxField;
