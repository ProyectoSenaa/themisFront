import React from "react";

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className }) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

export default AlertDescription;
