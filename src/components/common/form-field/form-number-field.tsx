"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
  type UseFormReturn,
} from "react-hook-form";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";

interface FormNumberFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  disabled?: boolean;
  helper?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
}

const FormNumberField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  disabled = false,
  helper,
  required = false,
  min,
  max,
  step = 1,
  size = "md",
}: FormNumberFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField
          name={name as string}
          render={() => (
            <FormItem className={cn(size === "sm" && "space-y-0.5")}>
              <FormLabel className={cn(size === "sm" && "text-xs")}>{formLabel}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  disabled={disabled}
                  min={min}
                  max={max}
                  step={step}
                  required={required}
                  className={cn(size === "sm" && "h-8 text-xs")}
                />
              </FormControl>
              {helper && <FormDescription>{helper}</FormDescription>}
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

export default FormNumberField;
