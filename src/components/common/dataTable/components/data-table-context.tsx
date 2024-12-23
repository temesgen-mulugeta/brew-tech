import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { SortOrder } from '@/models/misc/SortOrder';

// Types
export type TableSorting = {
  sortBy: string;
  sortOrder: SortOrder;
};

export type DataTableFilter = {
  [key: string]: string[];
};

export type DataTableFilterOptionsType = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type DataTableOptions = {
  query?: string;
  onQueryChange?: (query?: string) => void;
  onSortChange?: (sort: TableSorting) => void;
  onFilterChange?: (filters: DataTableFilter) => void;
  toolbarActions?: ReactNode;
  disableToolbar?: boolean;
  filterOptions?: {
    filter: string;
    initialValue?: string[] | null;
    options: DataTableFilterOptionsType[];
  }[];
};

export type DataTableContextProps = {
  setQuery?: (query: string) => void;
  sort?: TableSorting | null;
  setSort?: (sort: TableSorting) => void;
  filters?: DataTableFilter;
  setFilters?: (filters: DataTableFilter) => void;
} & DataTableOptions;

// Context
export const DataTableContext = createContext<DataTableContextProps>({});

// Provider
type DataTableProviderProps = {
  options?: DataTableContextProps;
} & PropsWithChildren;

export const DataTableProvider = ({
  children,
  options,
}: DataTableProviderProps) => {
  const [query, setQuery] = useState<string>(options?.query ?? '');
  const [sort, setSort] = useState<TableSorting | null>(options?.sort ?? null);
  const [filters, setFilters] = useState<DataTableFilter>(
    options?.filters ?? {},
  );

  const handleSortChange = (newSort: TableSorting) => {
    setSort(newSort);
    if (options?.onSortChange) {
      options.onSortChange(newSort);
    }
  };

  const handleFilterChange = (newFilters: DataTableFilter) => {
    setFilters(newFilters);
    options?.onFilterChange?.(newFilters);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (options?.onQueryChange) {
      options.onQueryChange(newQuery);
    }
  };

  const contextValue = {
    ...options,
    query,

    setQuery: handleQueryChange,
    sort,
    setSort: handleSortChange,
    filters,
    setFilters: handleFilterChange,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      {children}
    </DataTableContext.Provider>
  );
};

// Hook
export const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error(
      'useDataTableContext must be used within a DataTableProvider',
    );
  }
  return context;
};
