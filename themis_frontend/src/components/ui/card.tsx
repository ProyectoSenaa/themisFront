import React from 'react';
import clsx from 'clsx';

import { twMerge } from 'tailwind-merge';

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
      default: theme === 'dark'
        ? 'bg-[#00304D] text-white'
        : 'bg-white text-gray-900',
      outlined: theme === 'dark'
        ? 'text-white'
        : 'text-gray-900',
      filled: theme === 'dark'
        ? 'bg-gradient-to-br from-[#00304D] to-[#005386] text-white'
        : 'bg-gradient-to-br from-[#398f0d] to-lime-500 text-white',
    };
    const sizes = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-10',
    };
    return (
      <div
        ref={ref}
        className={twMerge(clsx(base, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

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

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-bold ${className || ''}`} {...props}>
      {children}
    </h2>
  )
);

CardTitle.displayName = 'CardTitle';

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

export default Card;
