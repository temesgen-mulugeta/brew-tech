/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDown,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDataTableContext } from "./data-table-context";
import { SortOrder } from "@/models/misc/SortOrder";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  sortingTitle: string;
  title: string;
  visibiltyToggle?: boolean;
}

export function ServerSortableTableHeader<TData, TValue>({
  sortingTitle,
  title,
  className,
  visibiltyToggle = true,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { sort, setSort } = useDataTableContext();

  const isSortedAsc =
    sort?.sortBy === sortingTitle && sort.sortOrder === SortOrder.Asc;
  const isSortedDesc =
    sort?.sortBy === sortingTitle && sort.sortOrder === SortOrder.Desc;

  const handleSortChange = (sortOrder: SortOrder) => {
    if (setSort) setSort({ sortBy: sortingTitle, sortOrder });
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent text-sm font-medium"
          >
            <span>{title}</span>
            {isSortedDesc ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : isSortedAsc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSortChange(SortOrder.Asc)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange(SortOrder.Desc)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          {visibiltyToggle && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  /* Hide column logic here */
                }}
              >
                <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
