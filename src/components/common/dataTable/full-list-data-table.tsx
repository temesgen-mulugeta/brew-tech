"use client";

import * as React from "react";
import { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import BaseDataTable from "./components/base-data-table";
import {
  DataTableOptions,
  DataTableProvider,
} from "./components/data-table-context";

interface FullListDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  fetchData: () => Promise<TData[]>;
  queryKey: string[];
  options?: DataTableOptions;
}

export function FullListDataTable<TData, TValue>({
  columns,
  fetchData,
  queryKey,
  options,
}: FullListDataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: fetchData,
    refetchOnMount: true,
  });

  const table = useReactTable({
    data: isSuccess ? data : [],
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: isSuccess ? Math.ceil(data.length / pagination.pageSize) : 0,
  });

  return (
    <DataTableProvider options={options}>
      <BaseDataTable columns={columns} table={table} isLoading={isLoading} />
    </DataTableProvider>
  );
}
