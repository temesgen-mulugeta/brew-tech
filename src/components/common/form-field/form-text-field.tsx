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

interface FormTextFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  type?: string;
  disabled?: boolean;
  helper?: string;
  parseValue?: (value: string) => unknown;
  textConverter?: (value: string) => string;
  onKeyDown?: {
    key: string;
    callback: () => void;
    preventDefault?: boolean;
  };
  required?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
}

const FormTextField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  disabled = false,
  type = "text",
  helper,
  parseValue,
  textConverter,
  onKeyDown,
  required = false,
  className,
  size,
  placeholder,
}: FormTextFieldProps<T>) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown && onKeyDown.key === event.key) {
      if (onKeyDown.preventDefault) {
        event.preventDefault();
      }
      onKeyDown.callback();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField
          name={name as string}
          render={() => (
            <FormItem className={cn(size === "sm" && "space-y-0.5")}>
              <FormLabel className={cn(size === "sm" && "text-xs")}>
                {formLabel}
              </FormLabel>
              <FormControl>
                <Input
                  className={cn(className, size === "sm" && "h-8 text-xs")}
                  id={name as string}
                  type={type}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const newValue = textConverter
                      ? textConverter(e.target.value)
                      : e.target.value;
                    field.onChange(
                      parseValue ? parseValue(newValue) : newValue
                    );
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={disabled}
                  onKeyDown={handleKeyDown}
                  required={required}
                  placeholder={placeholder}
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

export default FormTextField;
