"use client";

import * as React from "react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Table as TabelType } from "@tanstack/react-table";
import { useDataTableContext } from "./data-table-context";
import EmptyState from "@/components/common/misc/empty-state";
import { cn } from "@/lib/utils";

interface BaseDataTableProps<TData, TValue> {
  table: TabelType<TData>;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  totalCount?: number;
  onRowClick?: (data: TData) => void;
}
const BaseDataTable = <TData, TValue>({
  table,
  columns,
  isLoading,
  totalCount,
  onRowClick,
}: BaseDataTableProps<TData, TValue>) => {
  const { query, disableToolbar } = useDataTableContext();

  function highlightText(text: unknown, query: string): JSX.Element[] {
    // Handle React elements by extracting their text content
    if (React.isValidElement(text)) {
      return [<>{text}</>];
    }

    // Convert non-string values to string
    const safeText = typeof text === "string" ? text : String(text);

    // Don't process empty queries
    if (!query) return [<>{safeText}</>];

    const parts = safeText.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={"part" + index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        <React.Fragment key={"Main" + index}>{part}</React.Fragment>
      )
    );
  }

  return (
    <div className="space-y-4">
      {!disableToolbar && (
        <div className="ml-1 mt-1">
          <DataTableToolbar table={table} />
        </div>
      )}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={"row" + headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={"head" + header.id}
                        style={{
                          width: header.getSize(),
                          maxWidth: header.getSize(),
                          minWidth: header.getSize(),
                        }}
                        className="py-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={"row" + index}>
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className="py-2"
                        style={{
                          width: column.size,
                          maxWidth: column.size,
                          minWidth: column.size,
                        }}
                      >
                        <div className="animate-pulse bg-slate-100 my-2 h-4 w-full rounded-sm"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id + index}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      "hover:bg-gray-50",
                      onRowClick && "hover:cursor-pointer"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const cellContent = cell.getValue();
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                            minWidth: cell.column.getSize(),
                          }}
                          className="py-2"
                        >
                          <div className="overflow-hidden text-ellipsis">
                            {query && cellContent
                              ? highlightText(cellContent, query)
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:cursor-default hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-40 py-8"
                    key={"NO RESULT"}
                  >
                    <EmptyState
                      title="No results found"
                      description="Try adjusting your search or filters"
                      className="my-8"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTablePagination table={table} totalCount={totalCount} />
      </div>
    </div>
  );
};

export default BaseDataTable;
