"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  label: string;  // accessible label for screen readers
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listId = useId();

  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const selected = options[selectedIndex];

  function open() {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  }

  function close({ refocus = true } = {}) {
    setIsOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function choose(index: number) {
    onChange(options[index].value);
    close();
  }

  useEffect(() => {
    if (isOpen) optionRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function handleTriggerKeyDown(event: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      open();
    }
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((i) => Math.min(i + 1, last)),
      ArrowUp: () => setActiveIndex((i) => Math.max(i - 1, 0)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      " ": () => choose(activeIndex),
      Escape: () => close(),
    };

    if (event.key === "Tab") {
      close({ refocus: false });
      return;
    }
    if (keys[event.key]) {
      event.preventDefault();
      keys[event.key]();
    }
  }

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={`${label}: ${selected.label}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className={twMerge(
          "inline-flex cursor-pointer items-center gap-2 rounded-full py-2 pl-4 pr-3 text-sm font-bold ring-[1.5px] ring-current transition-[box-shadow,background-color,color] hover:shadow-md md:text-base",
          className,
        )}
      >
        {selected.label}
        <FaChevronDown
          aria-hidden
          className={twMerge(
            "size-3 fill-current transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          onKeyDown={handleListKeyDown}
          className="absolute left-0 top-full z-30 mt-2 flex min-w-full flex-col rounded-xl border border-primary/20 bg-background p-1 shadow-md"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => choose(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={twMerge(
                  "flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 flock-body-sm text-foreground outline-none",
                  index === activeIndex && "bg-accent/15",
                  isSelected && "font-bold",
                )}
              >
                {option.icon && (
                  <span aria-hidden className="inline-flex w-4 justify-center">
                    {option.icon}
                  </span>
                )}
                <span className="flex-1">{option.label}</span>
                {isSelected && (
                  <FaCheck aria-hidden className="size-3 fill-secondary" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
