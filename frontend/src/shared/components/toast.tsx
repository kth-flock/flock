"use client";
import { createContext, useContext, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

type Position = "bottom-right" | "bottom-center";
type Variant = "success" | "error";

const ToastContext = createContext<
  (message: string, position?: Position, variant?: Variant) => void
>(() => {});

const positionClasses = {
  "bottom-right": "right-4 items-end",
  "bottom-center": "left-1/2 -translate-x-1/2 items-center",
};

const variantClasses = {
  success: "border-primary text-success",
  error: "border-error text-error",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    position: Position;
    variant: Variant;
  } | null>(null);

  const show = (
    message: string,
    position: Position = "bottom-right",
    variant: Variant = "success",
  ) => {
    setToast({ message, position, variant });
    setTimeout(() => setToast(null), 8000);
  };

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 z-50 w-[min(90vw,40rem)] flex flex-col ${positionClasses[toast.position]}`}
        >
          <div
            className={` flex flex-row  gap-2 items-center rounded-xl border bg-background px-8 py-4 flock-lead shadow-lg ${variantClasses[toast.variant]}`}
          >
            {toast.variant === "success" ? <FaCheck /> : <FaXmark />}
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
