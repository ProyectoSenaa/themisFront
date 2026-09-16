import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', size = 'md', theme = 'light', ...props }, ref) => {
    const base = 'rounded-xl shadow-xl transition-all duration-300 overflow-hidden';
    const variants = {
      default: theme === 'dark' ? 'bg-[#00304D] text-white' : 'bg-white text-gray-900',
      outlined: theme === 'dark' ? 'border border-[#005386] bg-[#00304D] text-white' : 'border border-gray-200 bg-white text-gray-900',
      filled: theme === 'dark' ? 'bg-gradient-to-br from-[#00304D] to-[#005386] text-white' : 'bg-gradient-to-br from-[#398f0d] to-lime-500 text-white',
    };
    const sizes = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-10',
    };
    return (
      <div
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;