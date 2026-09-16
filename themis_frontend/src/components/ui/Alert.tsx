import React from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className }) => {
  return (
    <div className={cn("relative w-full rounded-lg border p-4", className)}>
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ className, children }) => {
  return (
    <div className={cn("text-sm", className)}>
      {children}
    </div>
  );
};

export default Alert;
