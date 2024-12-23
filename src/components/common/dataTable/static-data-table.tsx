"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import BaseDataTable from "./components/base-data-table";
import {
  DataTableOptions,
  DataTableProvider,
} from "./components/data-table-context";

interface StaticDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  options?: DataTableOptions;
  isloading?: boolean;
}

export function StaticDataTable<TData, TValue>({
  columns,
  data,
  options,
  isloading,
}: StaticDataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) => {
      return Object.entries(item as object).some(([, value]) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);

  const table = useReactTable({
    data: filteredData ?? [],
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: filteredData
      ? Math.ceil(filteredData.length / pagination.pageSize)
      : 1,
  });

  return (
    <DataTableProvider
      options={{
        ...options,
        onQueryChange: (query?: string) => {
          setSearchQuery(query || "");
          setPagination({ pageIndex: 0, pageSize: pagination.pageSize }); // Reset to first page on search
        },
      }}
    >
      <BaseDataTable columns={columns} table={table} isLoading={isloading} />
    </DataTableProvider>
  );
}
