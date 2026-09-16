import React from "react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white dark:bg-[#232b3b] rounded-lg shadow-xl w-full max-w-md">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const AlertDialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const AlertDialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={`text-lg font-bold ${className}`}>{children}</h2>
);

export const AlertDialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">{children}</div>
);

export const AlertDialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-6 flex justify-end gap-2">{children}</div>
);

export const AlertDialogCancel: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onClick}>{children}</button>
);

export const AlertDialogAction: React.FC<{ children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }> = ({ children, onClick, disabled, className }) => (
  <button type="button" className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
);
