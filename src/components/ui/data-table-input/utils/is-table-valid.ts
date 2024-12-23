import { DTI_ColumnDef } from "../types/DTI-column-def";
import { DTI_Row } from "../types/DTI-row";
import { isRowEmpty } from "./is-row-empty";
import { validateCell } from "./validate-cell";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isTableValid = <T extends Record<string, any>>(
  columns: Array<DTI_ColumnDef<DTI_Row<T>, keyof T>>,
  rows: Array<DTI_Row<T>>
): boolean => {
  let isTableValid = true;

  // Check if all rows are empty
  if (rows.every(isRowEmpty)) {
    return false;
  }

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      const column = columns[colIdx];
      const row = rows[rowIdx];
      const cellValue = row[column.accessorKey];
      const errorMessage = validateCell<T, (typeof column)["accessorKey"]>(
        cellValue,
        row,
        column,
        rows
      );

      if (errorMessage) {
        if (!isRowEmpty(row) || rows.length === 1) {
          isTableValid = false;
        }
      }
    }
  }
  return isTableValid;
};
