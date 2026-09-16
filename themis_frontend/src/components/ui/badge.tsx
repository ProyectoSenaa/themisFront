import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const base = "inline-block px-3 py-1 rounded-full text-s font-semibold";
  const variants: Record<string, string> = {
    default: "bg-green-500 text-white",
    secondary: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
};

export default Badge;
