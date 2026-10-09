import { ReactNode, useEffect } from "react";
import { FaX } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { IconButton } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  canClose?: boolean;
  transparent?: boolean;
  bg?: string;
  className?: string;
  overflow?: string;
}

export default function Modal({
  isOpen,
  onClose = () => null,
  children,
  canClose = true,
  transparent = false,
  bg,
  className,
  overflow = "overflow-y-auto",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={twMerge(
          "min-w-75 max-w-[90vw] max-h-[90vh] shadow-lg flex flex-col",
          transparent
            ? "fixed rounded-2xl"
            : (bg ?? "bg-white") + " rounded-lg relative",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {canClose && (
          <IconButton
            type="button"
            variant="tertiary"
            onClick={onClose}
            className={twMerge(
              "z-100 absolute fill-foreground!",
              transparent ? "top-5 right-5" : "top-3 right-3",
            )}
            aria-label="Close modal"
          >
            <FaX />
          </IconButton>
        )}
        <div
          className={twMerge(
            "flex-1 min-h-0 max-h-[90vh]",
            overflow,
            transparent ? "" : "p-6",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
