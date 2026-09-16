import React, { useEffect, useState } from "react"

export interface BasicProps {
  children?: React.ReactNode
  className?: string
}

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const checkDark = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDarkMode;
}

export const Card: React.FC<BasicProps> = ({ children, className = "" }) => {
  const isDarkMode = useDarkMode();
  return (
    <div
      className={`rounded-lg border shadow-sm transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#1e3a1e] to-[#14532d] border-green-900 text-slate-100"
          : "bg-gradient-to-br from-lime-400 to-green-500 border-green-400 text-white"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<BasicProps> = ({ children, className = "" }) => {
  const isDarkMode = useDarkMode();
  return (
    <div
      className={`px-16 py-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<BasicProps> = ({ children, className = "" }) => {
  const isDarkMode = useDarkMode();
  return (
    <h3
      className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-900"} ${className}`}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<BasicProps> = ({ children, className = "" }) => {
  const isDarkMode = useDarkMode();
  return (
    <p
      className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"} ${className}`}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<BasicProps> = ({ children, className = "" }) => {
  const isDarkMode = useDarkMode();
  return (
    <div
      className={`px-6 py-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"} ${className}`}
    >
      {children}
    </div>
  );
};
