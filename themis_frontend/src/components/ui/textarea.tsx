import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

const Textarea: React.FC<TextareaProps> = ({ className = "", ...rest }) => {
  return (
    <textarea
      {...rest}
      className={`border rounded px-3 py-2 bg-white text-gray-900 border-gray-300 focus:border-[#398f0d] dark:bg-[#232b3b] dark:text-white dark:border-gray-700 dark:focus:border-[#00eaff] ${className}`}
    />
  );
};

export default Textarea;
