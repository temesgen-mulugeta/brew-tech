/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Button } from "../button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "../table";
import {
  DataTableInputField,
  DTI_CellChangeHandler,
  DTI_KeyDownHandler,
} from "./DataTableInputField";
import { DTI_Allowed_Types, DTI_ColumnDef } from "./types/DTI-column-def";
import { DTI_Row } from "./types/DTI-row";
import { ErrorState } from "./types/error-state";
import { getColumnData } from "./utils/get-column-data";
import { isRowEmpty } from "./utils/is-row-empty";
import { isTableValid } from "./utils/is-table-valid";
import { validateCell } from "./utils/validate-cell";

type AcceptsUndefined<T> = undefined extends T ? true : false;

interface Props<T extends Record<string, DTI_Allowed_Types>> {
  columns: Array<DTI_ColumnDef<DTI_Row<T>, keyof T>>;
  onChange?: (data: Array<DTI_Row<T>>) => void;
  onValidityChange?: (value: boolean) => void;
  fixedRows?: number[];
  initialRows?: Array<DTI_Row<T>>;
  showCount?: boolean;
  readonly?: boolean;
}

const DataTableInput = <T extends Record<string, DTI_Allowed_Types>>({
  columns,
  onChange,
  onValidityChange,
  fixedRows,
  initialRows,
  showCount = false,
  readonly = false,
}: Props<T>): JSX.Element => {
  const emptyRow = useMemo(() => ({}) as DTI_Row<T>, []);
  const [rows, setRows] = useState<Array<DTI_Row<T>>>([
    ...(initialRows ?? []),
    ...(!readonly ? [emptyRow] : []),
  ]);
  const [errors, setErrors] = useState<ErrorState[][]>([]);
  const [touched, setTouched] = useState<boolean[][]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      const firstInput = tableRef.current.querySelector("input");
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, []);

  useEffect(() => {
    const updatedErrors: ErrorState[][] = [];
    const updatedTouched: boolean[][] = [];

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx];
      updatedErrors[rowIdx] = [];
      updatedTouched[rowIdx] = [];

      updatedErrors[rowIdx] = columns.map(() => undefined);
      updatedTouched[rowIdx] = columns.map(() => false);

      if (isRowEmpty(row)) {
        // If the row is empty, do not set errors or touch
        updatedErrors[rowIdx] = columns.map(() => undefined);
        updatedTouched[rowIdx] = columns.map(() => false);
      } else {
        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
          const column = columns[colIdx];
          const cellValue = rows[rowIdx][column.accessorKey];
          const errorMessage = validateCell<T, (typeof column)["accessorKey"]>(
            cellValue,
            row,
            column,
            rows
          );

          updatedErrors[rowIdx][colIdx] = errorMessage
            ? { error: true, message: errorMessage }
            : undefined;
          updatedTouched[rowIdx][colIdx] = true;
        }
      }
    }

    setErrors(updatedErrors);
    setTouched(updatedTouched);
    setIsValid(isTableValid(columns, rows));

    const nonEmptyRows = rows.filter((row) => !isRowEmpty(row));
    requestAnimationFrame(() => {
      onChange?.(nonEmptyRows); // Only pass non-empty rows to onChange
    });
  }, []);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const validateRow = (
    rowIndex: number,
    updatedRows: Array<DTI_Row<T>>
  ): any[] => {
    return columns.map((col) => {
      const cellValue = updatedRows[rowIndex][col.accessorKey];
      const errorMessage = validateCell<T, (typeof col)["accessorKey"]>(
        cellValue,
        updatedRows[rowIndex],
        col,
        updatedRows
      );
      return errorMessage ? { error: true, message: errorMessage } : undefined;
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const setRowAsTouched = () => {
    return columns.map(() => true);
  };

  const handleCellChange: DTI_CellChangeHandler<T> = <K extends keyof T>(
    value: T[K] | undefined,
    rowIndex: number,
    column: DTI_ColumnDef<DTI_Row<T>, K>
  ): void => {
    setRows((rows) => {
      const { accessorKey } = column;
      const updatedRows = [...rows];

      const updatedRow: DTI_Row<T> = {
        ...updatedRows[rowIndex],
        [column.accessorKey]: value,
      };

      updatedRows[rowIndex] = updatedRow;
      // column.onChange?.(value as T[K] | null, {
      //   row: updatedRows[rowIndex],
      //   column: getColumnData(updatedRows, column.accessorKey),
      //   table: updatedRows,
      // });

      columns.forEach((column) => {
        if (column.accessorFunc) {
          updatedRows[rowIndex][column.accessorKey] = column.accessorFunc({
            row: updatedRow,
            table: updatedRows,
            column: getColumnData(rows, column.accessorKey),
          });
        }

        if (column.dependencies?.includes(accessorKey)) {
          if (column.defaultValue !== undefined) {
            updatedRows[rowIndex][column.accessorKey] = column.defaultValue({
              row: updatedRow,
              table: updatedRows,
              column: getColumnData(rows, column.accessorKey),
            });
          } else {
            if (true as AcceptsUndefined<T[K]>) {
              // Check if T[K] accepts undefined
              updatedRows[rowIndex][column.accessorKey] = undefined as T[K];
            } else {
              updatedRows[rowIndex][column.accessorKey] = {} as T[K];
            }
          }
        }
      });

      // Check if the updated row is empty
      if (isRowEmpty(updatedRow)) {
        const updatedErrors = [...errors];
        const updatedTouched = [...touched];

        // Clear errors and set touched to false for that row
        updatedErrors[rowIndex] = columns.map(() => undefined);
        updatedTouched[rowIndex] = columns.map(() => false);

        setErrors(updatedErrors);
        setTouched(updatedTouched);
      } else {
        const updatedRowErrors = validateRow(rowIndex, updatedRows);

        const updatedErrors = [...errors];
        updatedErrors[rowIndex] = updatedRowErrors;

        setErrors(updatedErrors);
      }

      column.onChange?.(value as T[K] | null, {
        row: updatedRows[rowIndex],
        column: getColumnData(rows, column.accessorKey),
        table: updatedRows,
      });

      const nonEmptyRows = updatedRows.filter((row) => !isRowEmpty(row));
      onChange?.(nonEmptyRows); // Only pass non-empty rows to onChange

      setIsValid(isTableValid(columns, updatedRows));

      return updatedRows;
    });
  };

  const handleKeyDown: DTI_KeyDownHandler = (
    event: KeyboardEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLDivElement
      | HTMLTextAreaElement
    >,
    rowIndex: number,
    columnIndex: number
  ): void => {
    const { key } = event;
    const isEnterKey = key === "Enter";

    if (isEnterKey) {
      event.preventDefault();

      const updatedErrors = [...errors];
      const updatedTouched = [...touched];

      if (!updatedErrors[rowIndex]) {
        updatedErrors[rowIndex] = [];
      }
      if (!updatedTouched[rowIndex]) {
        updatedTouched[rowIndex] = [];
      }

      const column = columns[columnIndex];
      const row = rows[rowIndex];
      const cellValue = row[column.accessorKey];
      const errorMessage = validateCell<T, (typeof column)["accessorKey"]>(
        cellValue,
        row,
        column,
        rows
      );

      updatedErrors[rowIndex][columnIndex] = errorMessage
        ? { error: true, message: errorMessage }
        : undefined;
      updatedTouched[rowIndex][columnIndex] = true;

      const isLastEditableColumn =
        columnIndex ===
        columns.findLastIndex(
          (column: any) =>
            !column.accessorFunc &&
            !(
              column.disabled?.(
                {
                  row: rows[rowIndex],
                  column: getColumnData(rows, column.accessorKey),
                  table: rows,
                },
                rowIndex
              ) ?? false
            )
        );

      if (isLastEditableColumn) {
        const updatedRowErrors = validateRow(rowIndex, rows);
        updatedErrors[rowIndex] = updatedRowErrors;
        updatedTouched[rowIndex] = setRowAsTouched();
      }

      setErrors(updatedErrors);
      setTouched(updatedTouched);

      setTimeout(() => {
        const isLastRow = rowIndex === rows.length - 1;

        if (
          isLastEditableColumn &&
          isLastRow &&
          isTableValid(columns, rows) &&
          !isRowEmpty(row)
        ) {
          setRows((prev) => [...prev, emptyRow]);
        }
        setTimeout(() => {
          focusNextCell(rowIndex, columnIndex);
        }, 0);
      }, 0);
    }
  };

  const handleRemoveRow = (rowIndex: number): void => {
    if (rows.length === 1) {
      return;
    }

    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    const nonEmptyRows = updatedRows.filter((row) => !isRowEmpty(row));

    const updatedErrors = errors.filter((_, index) => index !== rowIndex);
    const updatedTouched = touched.filter((_, index) => index !== rowIndex);

    setRows(updatedRows);
    onChange?.(nonEmptyRows); // Only pass non-empty rows to onChange

    setErrors(updatedErrors);
    setTouched(updatedTouched);

    setIsValid(isTableValid(columns, updatedRows));
  };

  const handleButtonClick = (rowIndex: number, columnIndex: number): void => {
    // Simulate an Enter keydown event
    const fakeEvent = {
      preventDefault: () => {},
      key: "Enter",
    } as KeyboardEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLDivElement
      | HTMLTextAreaElement
    >;
    handleKeyDown(fakeEvent, rowIndex, columnIndex);
  };

  const focusNextCell = (rowIndex: number, columnIndex: number): void => {
    let nextRowIndex = rowIndex;
    let nextCellIndex = columnIndex;

    // Try to find the next editable cell in the current row.
    nextCellIndex = columns.findIndex(
      (col, index) =>
        index > columnIndex &&
        !col.accessorFunc &&
        !(
          col.disabled?.(
            {
              row: rows[rowIndex],
              column: getColumnData(rows, col.accessorKey),
              table: rows,
            },
            rowIndex
          ) ?? false
        )
    );

    // If there's no next editable cell in the current row, move to the next row
    if (nextCellIndex === -1) {
      nextRowIndex += 1;
      // Find the first editable cell in the next row.
      nextCellIndex = columns.findIndex((col) => !col.accessorFunc);
    }

    // Get the next input element and focus it.
    const nextInput = tableRef.current?.querySelector(
      `[data-row="${nextRowIndex}"][data-col="${nextCellIndex}"] input`
    ) as HTMLInputElement | null;

    if (nextInput) {
      nextInput.focus();
    }
  };

  const lastEditableColumn = columns.findLastIndex(
    (column: any) =>
      !column.accessorFunc &&
      !(
        column.disabled?.(
          {
            row: rows[rows.length - 1],
            column: getColumnData(rows, column.accessorKey),
            table: rows,
          },
          rows.length - 1
        ) ?? false
      )
  );

  // Add a function to generate unique row keys
  const getRowKey = (rowIndex: number): string => {
    return `row-${rowIndex}`;
  };

  const renderCell = (
    row: DTI_Row<T>,
    column: DTI_ColumnDef<DTI_Row<T>, keyof T>,
    rowIndex: number,
    columnIndex: number
  ): JSX.Element => {
    return (
      <TableCell
        key={`${getRowKey(rowIndex)}-${column.accessorKey.toString()}`}
        data-row={rowIndex}
        data-col={columnIndex}
        style={{ width: column.size ? `${column.size}px` : "auto" }}
        {...column.cellProps?.({
          row,
          column: getColumnData(rows, column.accessorKey),
          table: rows,
        })}
      >
        <div
          className={cn(
            "flex w-full flex-1",
            column.justify === "left" && "justify-start",
            column.justify === "center" && "justify-center",
            column.justify === "right" && "justify-end"
          )}
        >
          <DataTableInputField
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            column={column}
            onCellChange={handleCellChange}
            onKeyDown={handleKeyDown}
            rows={rows}
            errors={errors}
            touched={touched}
            readonly={readonly}
          />
        </div>
      </TableCell>
    );
  };

  return (
    <Table ref={tableRef}>
      <TableHeader>
        <TableRow>
          {showCount && <TableCell key="count-header"></TableCell>}
          {columns.map((column) => (
            <TableCell
              key={`header-${column.accessorKey.toString()}`}
              style={{ width: column.size ? `${column.size}px` : "auto" }}
            >
              <div className={`text-${column.justify}`}>{column.header}</div>
            </TableCell>
          ))}
          <TableCell key="action-header-1"></TableCell>
          <TableCell key="action-header-2"></TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={getRowKey(rowIndex)}>
            {showCount && (
              <TableCell key={`count-${rowIndex}`}>
                <span className="font-bold">{rowIndex + 1}</span>
              </TableCell>
            )}
            {columns.map((column, columnIndex) =>
              renderCell(row, column, rowIndex, columnIndex)
            )}
            <TableCell>
              {!readonly && rowIndex === rows.length - 1 && (
                <Button
                  type="button"
                  onClick={() =>
                    handleButtonClick(rows.length - 1, lastEditableColumn)
                  }
                  variant="ghost"
                  size="icon"
                  disabled={readonly}
                  className="text-primary hover:text-primary hover:bg-primary/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
            <TableCell>
              {!readonly &&
                rows.length > 1 &&
                !fixedRows?.some((fr) => fr === rowIndex) && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveRow(rowIndex)}
                    disabled={readonly}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
            </TableCell>
          </TableRow>
        ))}
        {columns.some((column) => column.footer) && (
          <TableRow>
            {showCount && <TableCell key="footer-count"></TableCell>}
            {columns.map((column, columnIndex) => {
              const footer =
                column.footer?.({
                  column: getColumnData(rows, column.accessorKey),
                  table: rows,
                }) ?? "";
              return (
                <TableCell
                  key={`footer-${column.accessorKey.toString()}`}
                  data-row={rows.length}
                  data-col={columnIndex}
                >
                  <span className="font-bold">{footer}</span>
                </TableCell>
              );
            })}
            <TableCell key="footer-action-1" />
            <TableCell key="footer-action-2" />
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTableInput;
