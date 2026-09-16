import React from 'react';

interface BadgeProps {
  variant: string;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant, className, children }) => {
  // use an explicit arbitrary font-size (text-[12px]) to avoid global overrides of .text-xs
  // and make horizontal padding smaller on very small screens to avoid overflow
  const baseClass =
    "inline-flex items-center gap-2 px-3 sm:px-[12px] py-1 sm:py-1.5 rounded-full text-[12px] font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105";

  const getVariantClass = () => {
    switch (variant) {
      case 'success':
   return (
     "bg-gradient-to-r from-[#398f0d] to-lime-500 text-white hover:from-[#398f0d]/90 hover:to-lime-500/90 border border-[#398f0d]/20 " +
     "dark:from-blue-800 dark:to-blue-900 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:border-blue-800 dark:text-white") ;
      default:
   return (
     "bg-gradient-to-r from-[#398f0d] to-lime-500 text-white hover:from-[#398f0d]/90 hover:to-lime-500/90 border border-[#398f0d]/20 " +
     "dark:from-blue-800 dark:to-blue-900 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:border-blue-800 dark:text-white");
    }
  };

  return (
    // Evitar que la badge se reduzca o haga wrap cuando hay varias juntas.
    // Aplicamos inline style marginLeft:0 como medida definitiva contra reglas globales (.text-xs) que definían margin-left negativo.
    <span
      style={{ marginLeft: 0 }}
      className={`${baseClass} ${getVariantClass()} ${className || ""} flex-shrink-0 whitespace-nowrap`}
    >
      {children}
    </span>
  );
};
