// components/ui/toast.ts
import { toast as sonnerToast } from "sonner";

type ToastType = "default" | "success" | "error" | "warning" | "info";

const baseStyle = {
  borderRadius: "8px",
};

export const toast = {
  show: (message: string) => {
    sonnerToast(message);
  },

  success: (message: string) => {
    sonnerToast.success(message);
  },

  error: (message: string) => {
    sonnerToast.error(message);
  },

  warning: (message: string) => {
    sonnerToast(message, {
      style: {
        ...baseStyle,
        background: "#facc15",
        color: "#000",
      },
    });
  },

  info: (message: string) => {
    sonnerToast(message, {
      style: {
        ...baseStyle,
        background: "#3b82f6",
        color: "#fff",
      },
    });
  },
};