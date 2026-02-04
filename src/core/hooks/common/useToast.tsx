import React from "react";
import {
  toast,
  ToastContainer,
  Slide,
  type ToastOptions,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultConfig: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

type ToastMessage = string | React.ReactNode;

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const success = (message: ToastMessage, customConfig?: ToastOptions) =>
    toast.success(message, {
      ...defaultConfig,
      ...customConfig,
    });

  const error = (message: ToastMessage, customConfig?: ToastOptions) =>
    toast.error(message, {
      ...defaultConfig,
      ...customConfig,
    });

  const info = (message: ToastMessage, customConfig?: ToastOptions) =>
    toast.info(message, {
      ...defaultConfig,
      ...customConfig,
    });

  return { success, error, info };
};

export const ToastProvider: React.FC = () => (
  <ToastContainer
    position="top-right"
    className="responsive-toast-container"
    autoClose={2000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Slide}
  />
);
