import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableFilterOptionsType } from "./data-table-filter";
import { useDataTableContext } from "./data-table-context";
import { Separator } from "@/components/ui/separator";

type ServerTableFilterProps = {
  title: string;
  filterKey: string;
  initialValue?: string[];
  options: DataTableFilterOptionsType[];
};

export function ServerTableFilter({
  title,
  filterKey,
  options,
  initialValue,
}: ServerTableFilterProps) {
  const { filters, setFilters } = useDataTableContext();
  const [selectedValues, setSelectedValues] = useState(
    new Set<string>(initialValue)
  );

  useEffect(() => {
    if (filters && filters[filterKey]) {
      setSelectedValues(new Set(filters[filterKey]));
    }
  }, [filters, filterKey]);

  const handleSelectOption = (value: string) => {
    const updatedSelectedValues = new Set(selectedValues);
    if (updatedSelectedValues.has(value)) {
      updatedSelectedValues.delete(value);
    } else {
      updatedSelectedValues.add(value);
    }
    setSelectedValues(updatedSelectedValues);
    if (setFilters) {
      setFilters({
        ...filters,
        [filterKey]: Array.from(updatedSelectedValues),
      });
    }
  };

  const clearFilters = () => {
    setSelectedValues(new Set());
    if (setFilters) {
      setFilters({ ...filters, [filterKey]: [] });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className=" border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="outline"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="outline"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="outline"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelectOption(option.value)}
                >
                  {option.icon &&
                    React.createElement(option.icon, {
                      className: cn(
                        "mr-2 h-4 w-4",
                        selectedValues.has(option.value)
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      ),
                    })}

                  <span
                    className={
                      selectedValues.has(option.value)
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }
                  >
                    {option.label}
                  </span>
                  <CommandShortcut>
                    {selectedValues.has(option.value) && (
                      <Check className="w-3.5" />
                    )}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandItem
                  onSelect={clearFilters}
                  className="justify-center text-center"
                >
                  Clear filters
                </CommandItem>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
