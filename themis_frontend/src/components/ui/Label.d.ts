declare module "../../components/ui/Label" {
  import React from "react";

  export interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
  }

  const Label: React.FC<LabelProps>;
  export default Label;
}
