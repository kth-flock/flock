"use client";
import { createContext, useContext, useRef, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

const ToastContext = createContext<
  (message: string, variant?: Variant) => void
>(() => {});

type Variant = "success" | "error" | "info";

const bottomRight = "right-4 items-end";

const variantClasses = {
  success: "border-success text-success",
  error: "border-error text-error",
  info: "border-primary text-primary",
};

type ToastItem = { id: number; message: string; variant: Variant };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = (message: string, variant: Variant = "success") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toasts.length > 0 && (
        <div
          role="status"
          className={`fixed bottom-4 z-50 w-[min(90vw,40rem)] flex flex-col gap-2 ${bottomRight}`}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={` flex flex-row  gap-2 items-center rounded-xl border bg-background px-8 py-4 flock-lead shadow-lg ${variantClasses[toast.variant]}`}
            >
              {toast.variant === "info" ? (
                <></>
              ) : toast.variant == "error" ? (
                <FaXmark />
              ) : (
                <FaCheck />
              )}
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
