declare module "../../components/ui/Input" {
  import React from "react";

  export interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }

  const Input: React.FC<InputProps>;
  export default Input;
}
