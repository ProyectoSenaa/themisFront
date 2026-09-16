import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import Button from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { AlertType } from '../types';

interface ToastAlertProps {
  message: string;
  type: AlertType | '';
  duration?: number;
  onClose?: () => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible || !message) return null;

  const getAlertClass = () => {
    switch (type) {
      case "success":
  return "border-[#398f0d] bg-gradient-to-r from-[#398f0d] to-lime-500/10 dark:from-blue-800 dark:to-blue-900 dark:border-blue-800";
      case "error":
        return "border-destructive bg-destructive/10";
      case "warning":
        return "border-accent bg-accent/10";
      default:
        return "border-primary bg-primary/10";
    }
  };

  return (
    <Alert className={`mb-6 ${getAlertClass()}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        <Button 
          variant="ghost" 
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
        >
          <X size={16} />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
