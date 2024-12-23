import { DTI_Allowed_Types } from "./DTI-column-def";

export type DTI_Row<T extends Record<string, DTI_Allowed_Types>> = {
  [K in keyof T]: T[K];
};
