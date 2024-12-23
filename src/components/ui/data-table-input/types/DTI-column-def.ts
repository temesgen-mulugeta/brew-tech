import { DTI_Row } from "./DTI-row";
import { DTI_SelectOption, FieldType, JustifyType } from "./field-type";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export type DTI_Allowed_Types =
  | string
  | number
  | boolean
  | Date
  | DTI_SelectOption
  | undefined
  | string[]; 
export interface TableContext<
  T extends Record<string, any>,
  K extends keyof T,
> {
  row: DTI_Row<T>;
  column: Array<T[K] | undefined>;
  table: Array<DTI_Row<T>>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DTI_ColumnDef<T extends Record<string, any>, K extends keyof T> {
  type: FieldType;
  accessorKey: K;
  header: string;
  required: boolean | ((context: TableContext<T, K>) => boolean);
  justify?: JustifyType;
  size?: number;
  dependencies?: Array<keyof T>;
  isLoading?: boolean;
  isFetching?: boolean;
  validator?: (
    value: T[K] | null,
    context: TableContext<T, K>
  ) => string | undefined;
  accessorFunc?: (context: TableContext<T, K>) => T[K];
  defaultValue?: (context: TableContext<T, K>) => T[K];
  onChange?: (value: T[K] | null, context: TableContext<T, K>) => void;
  onInputChange?: (value: string, context: TableContext<T, K>) => void;
  disabled?: (context: TableContext<T, K>, rowIndex: number) => boolean;
  cellProps?: (context: TableContext<T, K>) => {};
  fieldProps?: (context: TableContext<T, K>) => {};
  options?: (
    context: TableContext<T, K>,
    rowIndex: number
  ) => Array<DTI_SelectOption<any>> | undefined;
  footer?: (context: Omit<TableContext<T, K>, "row">) => string;
  onOpen?: (context: TableContext<T, K>) => void;
  maxDate?: Date | ((context: TableContext<T, K>) => Date | undefined);
  minDate?: Date | ((context: TableContext<T, K>) => Date | undefined);
  min?: number | ((context: TableContext<T, K>) => number);
  step?: number;
  render?: (props: {
    value: T[K] | undefined;
    onChange: (value: T[K] | undefined) => void;
    onKeyDown: (event: React.KeyboardEvent<any>) => void;
    context: TableContext<T, K>;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
  }) => React.ReactNode;
}
