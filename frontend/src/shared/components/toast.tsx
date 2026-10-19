"use client";
import { createContext, useContext, useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

const ToastContext = createContext<
  (message: string, variant?: Variant) => void
>(() => {});

export const useToast = () => useContext(ToastContext);

type Variant = "success" | "error" | "info";

const bottomRight = "right-4 items-end";

const variantClasses = {
  success: "border-success text-success",
  error: "border-error text-error",
  info: "border-primary text-primary",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;

    variant: Variant;
  } | null>(null);

  const show = (
    message: string,

    variant: Variant = "success",
  ) => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 8000);
  };

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 z-50 w-[min(90vw,40rem)] flex flex-col ${bottomRight}`}
        >
          <div
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
        </div>
      )}
    </ToastContext.Provider>
  );
}
