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
  Controller,
  type FieldValues,
  type UseControllerProps,
  type UseFormReturn,
} from "react-hook-form";
import { Input } from "../../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormPasswordFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  disabled?: boolean;
  message?: string;
  parseValue?: (value: string) => unknown;
  textConverter?: (value: string) => string;
  onKeyDown?: {
    key: string;
    callback: () => void;
    preventDefault?: boolean;
  };
}

const FormPasswordField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  disabled = false,
  message,
  parseValue,
  textConverter,
  onKeyDown,
}: FormPasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

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
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormField
          name={name as string}
          render={() => (
            <FormItem>
              <FormLabel>{formLabel}</FormLabel>
              <FormControl className="relative">
                <div>
                  <Input
                    id={name as string}
                    type={showPassword ? "text" : "password"}
                    value={value ?? ""}
                    onChange={(e) => {
                      const inputValue = textConverter
                        ? textConverter(e.target.value)
                        : e.target.value;
                      onChange(
                        parseValue ? parseValue(inputValue) : inputValue
                      );
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </div>
                </div>
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

export default FormPasswordField;
