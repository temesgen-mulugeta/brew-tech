import { DTI_Row } from "../types/DTI-row";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isRowEmpty = <T extends Record<string, any>>(
  row: DTI_Row<T>
): boolean => {
  //TODO: TALK WITH SILV
  if (Object.keys(row).length === 0) {
    return true;
  }
  for (const key in row) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      if (row[key]) {
        return false;
      }
    }
  }
  return true;
};
