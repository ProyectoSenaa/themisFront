import React from 'react';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={`mb-2 flex items-start justify-between ${className || ''}`} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export default CardHeader;