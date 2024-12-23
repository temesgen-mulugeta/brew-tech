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
import { Textarea } from "@/components/ui/textarea";

interface FormTextFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  disabled?: boolean;
  message?: string;
  rows?: number;
  parseValue?: (value: string) => unknown;
  textConverter?: (value: string) => string;
  className?: string;
}

const FormTextArea = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  disabled = false,
  message,
  rows,
  parseValue,
  textConverter,
  className,
}: FormTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormField
          name={name as string}
          render={() => (
            <FormItem>
              <FormLabel>{formLabel}</FormLabel>
              <FormControl>
                <Textarea
                  id={name as string}
                  className={className}
                  value={value ?? ""}
                  onChange={(e) => {
                    const value = textConverter
                      ? textConverter(e.target.value)
                      : e.target.value;
                    onChange(parseValue ? parseValue(value) : value);
                  }}
                  onBlur={onBlur}
                  ref={ref}
                  disabled={disabled}
                  rows={rows}
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
    />
  );
};

export default FormTextArea;
