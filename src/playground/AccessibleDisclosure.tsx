"use client";

import { useState, useId, ReactNode } from "react";

interface AccessibleDisclosureProps {
  title: string;
  children: ReactNode;
}

export function AccessibleDisclosure({ title, children }: AccessibleDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-neutral-900 hover:bg-neutral-50"
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform duration-200 text-neutral-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        id={panelId}
        hidden={!isOpen}
        className="p-4 pt-0 text-sm text-neutral-600 border-t border-neutral-100"
      >
        {children}
      </div>
    </div>
  );
}