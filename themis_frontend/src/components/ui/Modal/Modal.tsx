import React from 'react';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, children, className = '', overlayClassName = '', ...props }, ref) => {
    if (!open) return null;
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm ${overlayClassName}`}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div
          ref={ref}
          className={`relative ${className}`}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
export default Modal;
