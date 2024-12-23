import { DTI_Row } from "../types/DTI-row";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getColumnData = <T extends Record<string, any>, K extends keyof T>(
  rows: T[],
  accessorKey: K
): Array<DTI_Row<T>[K]> => {
  const data: Array<DTI_Row<T>[K]> = [];
  for (const row of rows) {
    data.push(row[accessorKey]);
  }
  return data;
};
