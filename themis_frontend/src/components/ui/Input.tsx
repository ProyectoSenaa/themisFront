import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input: React.FC<InputProps> = ({ className = "", ...rest }) => {
  return (
    <input
      {...rest}
      className={`border rounded px-3 py-2 bg-white text-gray-900 border-gray-300 focus:border-[#398f0d] dark:bg-[#232b3b] dark:text-white dark:border-gray-700 dark:focus:border-[#00eaff] ${className}`}
    />
  );
};

export default Input;
