import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

const Select: React.FC<SelectProps> = ({ value, onValueChange, children, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = "" }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  const { open, setOpen } = context;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`
        flex items-center justify-between w-full px-4 py-2.5
        bg-white dark:bg-slate-800 
        border border-slate-200 dark:border-slate-700
        rounded-xl
        text-sm text-left
        hover:border-slate-300 dark:hover:border-slate-600
        focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
      <ChevronDown 
        className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${
          open ? "rotate-180" : ""
        }`} 
      />
    </button>
  );
};

export const SelectValue: React.FC<{ 
  children?: React.ReactNode; 
  placeholder?: string;
  className?: string;
}> = ({ children, placeholder, className = "" }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  const { value } = context;

  // Find the selected item's label
  const getSelectedLabel = () => {
    if (children) return children;
    if (!value) return placeholder || "Seleccionar...";
    return value;
  };

  return (
    <span className={`block truncate ${!value ? "text-slate-400" : "text-slate-900 dark:text-slate-100"} ${className}`}>
      {getSelectedLabel()}
    </span>
  );
};

export const SelectContent: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");

  const { open, setOpen, value } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        const trigger = contentRef.current.previousElementSibling;
        if (trigger && !trigger.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={`
        absolute z-[10000] w-full mt-2
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        rounded-xl shadow-lg
        max-h-[300px] overflow-y-auto
        py-1
        animate-in fade-in-0 zoom-in-95
        ${className}
      `}
    >
      <SelectContext.Provider value={{ ...context, value }}>
        {children}
      </SelectContext.Provider>
    </div>
  );
};

export const SelectItem: React.FC<{ 
  value: string; 
  children: React.ReactNode;
  className?: string;
}> = ({ value, children, className = "" }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const { value: selectedValue, onValueChange, setOpen } = context;
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        flex items-center justify-between w-full px-4 py-2.5
        text-sm text-left
        hover:bg-slate-100 dark:hover:bg-slate-700/50
        focus:bg-slate-100 dark:focus:bg-slate-700/50
        focus:outline-none
        transition-colors
        ${isSelected ? "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400" : "text-slate-900 dark:text-slate-100"}
        ${className}
      `}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 ml-2" />
      )}
    </button>
  );
};

export default Select;