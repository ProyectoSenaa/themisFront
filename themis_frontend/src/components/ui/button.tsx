import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children?: React.ReactNode; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none";

  const variants: Record<string, string> = {
    // keep light-mode green but add dark-mode blue equivalents
    default: "bg-[#398f0d] text-white hover:bg-[#398f0d]-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-900 dark:text-gray-100",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
