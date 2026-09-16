import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IAlertProps from "../interfaces/components_interfaces/Alert/IAlertProps";

const Alert: React.FC<IAlertProps> = ({ message, type, duration = 3000 }) => {
  React.useEffect(() => {
    const showToast = () => {
      switch (type) {
        case "success":
          toast.success(message, { autoClose: duration });
          break;
        case "error":
          toast.error(message, { autoClose: duration });
          break;
        case "info":
          toast.info(message, { autoClose: duration });
          break;
        case "warning":
          toast.warn(message, { autoClose: duration });
          break;
        default:
          toast(message, { autoClose: duration });
      }
    };
    showToast();
  }, [message, type, duration]);

  return <ToastContainer />;
};

export default Alert;