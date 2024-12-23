"use client";

import { Table } from "@tanstack/react-table";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useDataTableContext } from "./data-table-context";
import _ from "lodash";
import { useCallback } from "react";
import { ServerTableFilter } from "./server-table-filter";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  // filters?: { header: string; filters: DataTableFilterOptionsType[] }[];
}

export function DataTableToolbar<TData>({
  table, // filters,
}: DataTableToolbarProps<TData>) {
  //TODO: work on search filer
  const {
    toolbarActions: actions,
    onQueryChange,
    query,
    setQuery,
    filterOptions,
  } = useDataTableContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnQueryChange = useCallback(
    _.debounce((query) => {
      onQueryChange?.(query);
      setQuery?.(query);
    }, 500),
    []
  );

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-1 items-start space-x-2">
        <section className="flex space-x-1">
          <div className="relative flex items-center">
            <Input
              placeholder="Search"
              defaultValue={query}
              onChange={(event) => {
                debouncedOnQueryChange(event.target.value);
              }}
              className="h-10 pl-8 w-[150px] lg:w-[250px]"
            />
            <Search className="absolute w-4 h-4 ml-2" />
          </div>
        </section>
        <div className="flex flex-wrap gap-1">
          {filterOptions?.map((filter, index) => (
            <ServerTableFilter
              initialValue={filter.initialValue ?? undefined}
              key={index}
              title={filter.filter}
              filterKey={filter.filter}
              options={filter.options}
            />
          ))}
        </div>
      </div>
      <div className="flex space-x-1 h-8">
        <DataTableViewOptions table={table} />
        {actions}
      </div>
    </div>
  );
}
