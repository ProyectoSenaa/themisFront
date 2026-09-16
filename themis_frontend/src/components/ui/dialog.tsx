"use client"
import React from "react"
import { createPortal } from "react-dom"

// ...existing code...
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!open) return null;

  const dialog = (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 dark:bg-black/80 backdrop-blur-md"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-visible max-h-[90vh] rounded-2xl dark:shadow-2xl shadow-lime-200/30 dark:shadow-lime-900/40 bg-white/90 dark:bg-[#1a2e1a]/90 backdrop-blur-xl p-0">
          {children}
        </div>
        <button
          className="absolute top-4 right-4 z-10 text-white bg-[#1abc60] dark:text-white dark:bg-[#0A3952] hover:bg-[#169c4a] dark:hover:bg-[#11567a] text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full shadow hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1abc60] dark:focus:ring-[#0A3952]"
          onClick={() => onOpenChange(false)}
          aria-label="Cerrar"
        >
          <span className="sr-only">Cerrar</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )

  return typeof document !== "undefined" ? createPortal(dialog, document.body) : null
};
// ...existing code...
export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);

export const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <div className={`px-0 pt-0 pb-4 ${className}`}>{children}</div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => (
  <h2 className={`text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight ${className}`}>{children}</h2>
);