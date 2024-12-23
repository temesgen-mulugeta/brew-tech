export type FieldType = "text" | "select" | "autocomplete" | "date" | "number" | "checkBox" | "custom"; 

export type JustifyType = "left" | "center" | "right";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DTI_SelectOption<O = any> {
  value: string;
  label: string;
  original: O;
}
