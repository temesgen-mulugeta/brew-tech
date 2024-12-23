"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PagedList from "@/models/PaginatedList";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import BaseDataTable from "./components/base-data-table";
import {
  DataTableOptions,
  DataTableProvider,
} from "./components/data-table-context";

interface PaginatedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  fetchData: (pageIndex: number, pageSize: number) => Promise<PagedList<TData>>;
  onRowClick?: (data: TData) => void;
  queryKey: string[];
  options?: DataTableOptions;
}

export function PaginatedDataTable<TData, TValue>({
  columns,
  fetchData,
  queryKey,
  onRowClick,
  options,
}: PaginatedDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pageCount, setPageCount] = React.useState(0);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isSuccess, isFetching, isLoading } = useQuery({
    queryKey: [...queryKey, pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      return fetchData(pagination.pageIndex, pagination.pageSize);
    },
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setPageCount(data.TotalPages);
    }
  }, [isSuccess, data?.TotalPages]);

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  }, [fetchData]);

  //TODO: MANAGE SORTING
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data: data?.Items ?? [],
    columns: columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    manualPagination: true,
    pageCount,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <DataTableProvider options={options}>
      <BaseDataTable
        totalCount={data?.TotalCount}
        columns={columns}
        table={table}
        onRowClick={onRowClick}
        isLoading={isLoading || isFetching}
      />
    </DataTableProvider>
  );
}
