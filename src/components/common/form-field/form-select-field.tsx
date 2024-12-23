import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import { type FieldValues, type UseControllerProps, type UseFormReturn, Controller, type Control } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


interface FormSelectFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  formLabel: string;
  form: UseFormReturn<T>;
  options: { value: string; label: string; description?: string }[];
  disabled?: boolean;
  message?: string;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  selectClassName?: string;
}

const FormSelectField = <T extends FieldValues>({
  name,
  control,
  formLabel,
  form,
  options,
  disabled = false,
  message,
  onChange,
  onOpenChange,
  className,
  selectClassName,
}: FormSelectFieldProps<T>) => {
  return (
    <Controller
      render={({ field }) => (
        <FormField
          name={name}
          control={form.control as Control<T>}
          // control={form.control}
          render={() => (
            <FormItem className={className}>
              <FormLabel>{formLabel}</FormLabel>

              <Select
                disabled={disabled}
                onValueChange={(e: string) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
                onOpenChange={onOpenChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={`w-full whitespace-normal text-left ${selectClassName}`}
                  >
                    <SelectValue> 
                      {options.find((o) => o.value === field.value)?.label ||
                        formLabel}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="whitespace-normal"
                      data-label={option.label}
                    >
                      <div className="flex flex-col py-1">
                        <div>{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

export default FormSelectField;
