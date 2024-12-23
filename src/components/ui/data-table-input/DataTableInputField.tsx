import { Input } from "@/components/ui/input";
import React from "react";
import { Checkbox } from "../checkbox";
import { ComboBox } from "../combo-box";
import { DTI_ColumnDef } from "./types/DTI-column-def";
import { DTI_Row } from "./types/DTI-row";
import { ErrorState } from "./types/error-state";
import { getColumnData } from "./utils/get-column-data";
import { DatePicker } from "@/components/ui/date-picker";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DTI_CellChangeHandler<T extends Record<string, any>> = <
  K extends keyof T,
>(
  value: T[K] | undefined,
  rowIndex: number,
  column: DTI_ColumnDef<DTI_Row<T>, K>
) => void;

export type DTI_InputElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLDivElement
  | HTMLTextAreaElement;

export type DTI_KeyDownHandler = (
  event: React.KeyboardEvent<DTI_InputElement>,
  rowIndex: number,
  columnIndex: number
) => void;

interface Props<T extends Record<string, any>, K extends keyof T> {
  rowIndex: number;
  columnIndex: number;
  column: DTI_ColumnDef<DTI_Row<T>, K>;
  onCellChange: DTI_CellChangeHandler<T>;
  onKeyDown: DTI_KeyDownHandler;
  rows: Array<DTI_Row<T>>;
  errors: ErrorState[][];
  touched: boolean[][];
  readonly?: boolean;
}

export const DataTableInputField = <
  T extends Record<string, any>,
  K extends keyof T,
>({
  rowIndex,
  columnIndex,
  column,
  onCellChange,
  onKeyDown,
  rows,
  errors,
  touched,
  readonly = false,
}: Props<T, K>): JSX.Element => {
  const row = rows[rowIndex];

  const tableContext = {
    row,
    column: getColumnData(rows, column.accessorKey),
    table: rows,
  };

  const { accessorKey, accessorFunc, type } = column;
  const readOnly =
    readonly ||
    (column.disabled?.(tableContext, rowIndex) ?? false) ||
    column.accessorFunc !== undefined;
  const cellValue = accessorFunc
    ? accessorFunc?.(tableContext)
    : rows[rowIndex][accessorKey];
  const error =
    errors[rowIndex]?.[columnIndex]?.error && touched[rowIndex]?.[columnIndex];
  const errorHelperText =
    errors[rowIndex]?.[columnIndex]?.message && touched[rowIndex]?.[columnIndex]
      ? errors[rowIndex]?.[columnIndex]?.message
      : null;

  const fieldProps = React.useMemo(() => {
    return column.fieldProps?.(tableContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableContext]);

  const handleChange = (value: any): void => {
    return onCellChange(value as T[K] | undefined, rowIndex, column);
  };

  React.useEffect(() => {
    if (column.defaultValue !== undefined) {
      handleChange(column.defaultValue(tableContext));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (type) {
    case "date": {
      return (
        <div className="space-y-1 w-full">
          <DatePicker
            className="w-full"
            {...fieldProps}
            disabled={readOnly}
            value={cellValue}
            onChange={(value) => handleChange(value)}
          />
          {errorHelperText && (
            <p className="text-xs text-destructive">{errorHelperText}</p>
          )}
        </div>
      );
    }
    case "select":
    case "autocomplete": {
      return (
        <div className="space-y-1 w-full">
          <ComboBox
            {...fieldProps}
            disabled={readOnly}
            value={cellValue ?? ""}
            onChange={(value) => handleChange(value)}
            options={column.options?.(tableContext, rowIndex) ?? []}
            className={"w-full"}
            contentClassName={"w-full flex-grow flex-1"}
          />
          {errorHelperText && (
            <p className="text-xs text-destructive">{errorHelperText}</p>
          )}
        </div>
      );
    }
    case "checkBox": {
      return (
        <div className="space-y-1 flex flex-col items-center">
          <Checkbox
            {...fieldProps}
            disabled={readOnly}
            checked={cellValue as boolean}
            onCheckedChange={(value) => handleChange(value)}
            // onKeyDown={(event) => onKeyDown(event, rowIndex, columnIndex)}
            className={error ? "border-destructive" : ""}
          />
          {errorHelperText && (
            <p className="text-xs text-destructive">{errorHelperText}</p>
          )}
        </div>
      );
    }
    case "number":

    case "text":
      return (
        <div className="space-y-1 w-full">
          <Input
            {...fieldProps}
            disabled={readOnly}
            type={type}
            value={cellValue ?? ""}
            onChange={({ target: { value } }) =>
              handleChange(
                type === "number"
                  ? value === ""
                    ? undefined
                    : Number(value)
                  : value
              )
            }
            onKeyDown={(event) => onKeyDown(event, rowIndex, columnIndex)}
            className={error ? "border-destructive" : ""}
          />
          {errorHelperText && (
            <p className="text-xs text-destructive">{errorHelperText}</p>
          )}
        </div>
      );
    case "custom": {
      if (!column.render) {
        return <div>No render function provided for custom component</div>;
      }

      return (
        <div className="space-y-1 w-full">
          {column.render({
            value: cellValue,
            onChange: (value) => handleChange(value),
            onKeyDown: (event) => onKeyDown(event, rowIndex, columnIndex),
            context: tableContext,
            error,
            errorMessage: errorHelperText ?? undefined,
            disabled: readOnly,
          })}
          {errorHelperText && (
            <p className="text-xs text-destructive">{errorHelperText}</p>
          )}
        </div>
      );
    }
    default:
      return (
        <Input
          disabled
          type="text"
          value="Unsupported type"
          className={error ? "border-destructive" : ""}
        />
      );
  }
};
