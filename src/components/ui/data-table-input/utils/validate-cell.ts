import { DTI_ColumnDef } from "../types/DTI-column-def";
import { DTI_Row } from "../types/DTI-row";
import { getColumnData } from "./get-column-data";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateCell = <T extends Record<string, any>, K extends keyof T>(
  cellValue: T[K] | undefined,
  row: DTI_Row<T>,
  column: DTI_ColumnDef<DTI_Row<T>, K>,
  rows: Array<DTI_Row<T>>
): string | null | undefined => {
  let errorMessage: string | null | undefined = null;

  // First, check using the custom validator if it exists
  if (column.validator) {
    errorMessage = column.validator(cellValue ?? null, {
      row,
      column: getColumnData(rows, column.accessorKey),
      table: rows,
    });
  }

  // If the cell passes the custom validator, then check if it is required
  if (!errorMessage) {
    const required =
      typeof column.required === "function"
        ? column.required({
            row,
            column: getColumnData(rows, column.accessorKey),
            table: rows,
          })
        : column.required;

    if (required && cellValue === undefined) {
      errorMessage = "This field is required";
    }
  }

  return errorMessage;
};
