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
  type Control,
  Controller,
  type FieldValues,
  type UseControllerProps,
  type UseFormReturn,
} from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";

interface FormDateFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  disabled?: boolean;
  message?: string;
  startYear?: number;
  endYear?: number;
  disableFuture?: boolean;
  disablePast?: boolean;
  disabledDays?: Date[];
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const FormDateField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  disabled = false,
  message,
  startYear,
  endYear,
  disableFuture,
  disablePast,
  disabledDays,
  required = false,
  minDate,
  maxDate,
}: FormDateFieldProps<T>) => {
  return (
    <Controller
      render={({ field }) => (
        <FormField
          name={name}
          control={form.control as Control<T>}
          render={() => (
            <FormItem>
              <FormLabel>{formLabel}</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder={formLabel}
                  startYear={startYear}
                  endYear={endYear}
                  disableFuture={disableFuture}
                  disabledDays={disabledDays}
                  required={required}
                  minDate={minDate}
                  maxDate={maxDate}
                  disablePast={disablePast}
                />
              </FormControl>
              {message && <FormDescription>{message}</FormDescription>}
              <FormMessage>
                {form.formState.errors[name]?.message as string}
              </FormMessage>
            </FormItem>
          )}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default FormDateField;
