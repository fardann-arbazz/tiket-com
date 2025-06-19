import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "custom";

interface ToastProps {
  message: string | ReactNode;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  className?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
}

const Toast = ({
  message,
  type = "custom",
  duration = 5000,
  onClose,
  className = "",
  icon,
  showCloseButton = true,
}: ToastProps) => {
  // Auto-close after duration
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Get styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-50";
      case "error":
        return "bg-red-500/15 border-red-500/30 text-red-50";
      case "warning":
        return "bg-amber-500/15 border-amber-500/30 text-amber-50";
      case "info":
        return "bg-blue-500/15 border-blue-500/30 text-blue-50";
      default:
        return "bg-gray-800 border-gray-700 text-gray-100";
    }
  };

  // Get default icon based on type
  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        );
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        );
      case "info":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`relative flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getTypeStyles()} ${className}`}
    >
      {/* Custom icon or default icon */}
      {icon ||
        (type !== "custom" && (
          <div className="mt-0.5 flex-shrink-0">{getDefaultIcon()}</div>
        ))}

      {/* Message content - can be string or custom ReactNode */}
      <div className="flex-1 text-sm">{message}</div>

      {/* Close button */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="text-current/50 hover:text-current transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

// Toast Provider for managing multiple toasts
interface ToastProviderProps {
  children: ReactNode;
}

interface ToastItem extends ToastProps {
  id: string;
}

const ToastContext = createContext<{
  showToast: (toast: Omit<ToastProps, "onClose">) => void;
} | null>(null);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
