/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from '@/components/ui/checkbox';
import {
    Controller,
    type FieldValues,
    type UseControllerProps,
    type UseFormReturn,
} from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../ui/form';

interface FormCheckBoxFieldProps<T extends FieldValues> extends UseControllerProps<T> {
    formLabel: string;
    form: UseFormReturn<T>;
    type?: string;
    disabled?: boolean;
    message?: string;
    parseValue?: (value: string) => any;
    textConverter?: (value: string) => string;
}

const FormCheckBoxField = <T extends FieldValues>({
    name,
    control,
    formLabel,
    form,
    disabled = false,
    message,
}: FormCheckBoxFieldProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
                <FormField
                    name={name as string}
                    render={() => (
                        <FormItem>
                            <div className='flex items-center'>
                                <FormControl>
                                    <Checkbox
                                        id={name as string}
                                        checked={value}
                                        onCheckedChange={checked => {
                                            onChange(checked);
                                        }}
                                        onBlur={onBlur}
                                        ref={ref}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormLabel className='ml-2'>{formLabel}</FormLabel>
                            </div>

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

export default FormCheckBoxField;
