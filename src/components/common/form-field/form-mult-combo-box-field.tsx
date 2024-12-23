'use client';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../ui/form';
import {
    type FieldValues,
    type UseControllerProps,
    type UseFormReturn,
    type PathValue,
    type Path,
    Controller,
    type Control,
} from 'react-hook-form';

interface FormComboboxFieldProps<T extends FieldValues> extends UseControllerProps<T> {
    formLabel: string;
    form: UseFormReturn<T>;
    options: { value: string; label: string }[];
    disabled?: boolean;
    message?: string;
    onChange?: (selectedValues: string[]) => void;
    size?: 'sm' | 'md' | 'lg';
    enableSelectAll?: boolean;
    allOptionLabel?: string;
}

const FormMultiComboboxField = <T extends FieldValues>({
    name,
    control,
    formLabel,
    form,
    options,
    disabled = false,
    message,
    onChange,
    size = 'md',
    enableSelectAll = false,
    allOptionLabel = 'All',
}: FormComboboxFieldProps<T>) => {
    const [open, setOpen] = useState(false);

    const allOptions = enableSelectAll
        ? [{ value: 'all', label: allOptionLabel }, ...options]
        : options;

    const isSelected = (optionValue: string) => form.watch(name)?.includes(optionValue);

    const handleSelectOption = (optionValue: string) => {
        const currentValues = (form.watch(name) as string[]) || [];
        let updatedValues: string[];

        if (enableSelectAll) {
            if (optionValue === 'all') {
                updatedValues = ['all'];
            } else {
                if (isSelected(optionValue)) {
                    updatedValues = currentValues.filter(value => value !== optionValue);
                } else {
                    updatedValues = [
                        ...currentValues.filter(value => value !== 'all'),
                        optionValue,
                    ];
                }
            }
        } else {
            updatedValues = isSelected(optionValue)
                ? currentValues.filter(value => value !== optionValue)
                : [...currentValues, optionValue];
        }

        form.setValue(name, updatedValues as PathValue<T, Path<T>>);
        onChange?.(updatedValues);
    };

    const renderSelectedOptions = () => {
        const selectedOptions = allOptions.filter(option => isSelected(option.value));

        if (selectedOptions.length === 0) return formLabel;
        if (selectedOptions.length === 1) return selectedOptions[0]?.label || formLabel;
        if (isSelected('all')) return allOptionLabel;
        return `${selectedOptions.length} options selected`;
    };

    return (
        <Controller
            render={({}) => (
                <FormField
                    name={name}
                    control={form.control as Control<T>}
                    render={() => (
                        <FormItem className={cn(size === 'sm' && 'space-y-0.5')}>
                            <FormLabel className={cn(size === 'sm' && 'text-xs')}>
                                {formLabel}
                            </FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            onClick={() => setOpen(prev => !prev)}
                                            variant='outline'
                                            role='combobox'
                                            disabled={disabled}
                                            className='flex w-full justify-between truncate text-left'
                                            size={size === 'sm' ? 'sm' : undefined}>
                                            {renderSelectedOptions()}
                                            <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                    className='w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-content-available-width)] overflow-hidden p-0'
                                    onWheel={(e: React.WheelEvent) => {
                                        e.stopPropagation();
                                    }}
                                    onTouchMove={(e: React.TouchEvent) => {
                                        e.stopPropagation();
                                    }}>
                                    <Command className='overflow-hidden'>
                                        <CommandInput placeholder={`Search...`} />
                                        <CommandEmpty>No Item Found.</CommandEmpty>
                                        <ScrollArea className='h-[200px]'>
                                            <CommandList className='max-h-none'>
                                                <CommandGroup>
                                                    {allOptions.map(option => (
                                                        <CommandItem
                                                            value={`${option.value} ${option.label}`}
                                                            key={option.value}
                                                            onSelect={() =>
                                                                handleSelectOption(option.value)
                                                            }
                                                            className={cn(
                                                                'flex justify-between',
                                                                isSelected(option.value) &&
                                                                    'bg-accent/50'
                                                            )}>
                                                            <p className='truncate'>
                                                                {option.label}
                                                            </p>
                                                            <Check
                                                                className={cn(
                                                                    'ml-2 size-4',
                                                                    isSelected(option.value)
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0'
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </ScrollArea>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {message && <FormDescription>{message}</FormDescription>}
                            <FormMessage>
                                {form.formState.errors[name]?.message as string}
                            </FormMessage>
                        </FormItem>
                    )}></FormField>
            )}
            name={name}
            control={control}
        />
    );
};

export default FormMultiComboboxField;

export const filterAllOption = (values: string[]) => {
    if (values.includes('all')) {
        return values.filter(value => value !== 'all');
    }
    return values;
};
