import React from 'react';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={`flex-grow flex flex-col justify-center ${className || ''}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export default CardContent;