declare module "Select" {
  import React from "react";

  export interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
  }

  const Select: React.FC<SelectProps>;
  export const SelectContent: React.FC<{ children: React.ReactNode }>;
  export const SelectTrigger: React.FC<{ children: React.ReactNode }>;
  export const SelectValue: React.FC<{ children: React.ReactNode }>;

  export default Select;
}
