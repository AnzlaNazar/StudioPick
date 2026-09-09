"use client";

import { useState } from "react";
import { AccessibleModal } from "@/playground/AccessibleModal";
import { AccessibleTabs } from "@/playground/AccessibleTabs";
import { AccessibleDisclosure } from "@/playground/AccessibleDisclosure";

export default function PlaygroundPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const sampleTabs = [
    {
      id: "linear",
      label: "Linear Switches",
      content: "Smooth, consistent keystroke with minimal acoustic feedback. Ideal for quiet office desks.",
    },
    {
      id: "tactile",
      label: "Tactile Switches",
      content: "Moderate tactile bump at the actuation point. Ideal for high-accuracy typing workflows.",
    },
    {
      id: "clicky",
      label: "Clicky Switches",
      content: "Distinct bump accompanied by a sharp click. Satisfying acoustic profile for home setups.",
    },
  ];

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-10 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">FE-05 Accessible Components Playground</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Zero-dependency WAI-ARIA accessible primitives test environment.
        </p>
      </div>

      {/* 1. Modal Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-800">1. Accessible Modal (Dialog)</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
        >
          Open Checkout Modal
        </button>

        <AccessibleModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Review Custom Build"
        >
          <p>
            This modal traps keyboard focus inside. Press <kbd className="px-1.5 py-0.5 border rounded bg-neutral-100 font-mono text-xs">Tab</kbd> to cycle forward, <kbd className="px-1.5 py-0.5 border rounded bg-neutral-100 font-mono text-xs">Shift + Tab</kbd> to cycle backward, and <kbd className="px-1.5 py-0.5 border rounded bg-neutral-100 font-mono text-xs">Esc</kbd> to close.
          </p>
        </AccessibleModal>
      </section>

      {/* 2. Tabs Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-800">2. Accessible Tabs</h2>
        <p className="text-xs text-neutral-500">
          Focus the tab and navigate using <kbd className="px-1 border rounded bg-neutral-100">←</kbd> and <kbd className="px-1 border rounded bg-neutral-100">→</kbd> arrow keys.
        </p>
        <AccessibleTabs tabs={sampleTabs} />
      </section>

      {/* 3. Disclosure Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-800">3. Accessible Disclosure</h2>
        <AccessibleDisclosure title="Why did the AI recommend this switch?">
          Linear switches have a lower noise profile, preventing audio bleed into team calls while maintaining smooth travel for long typing sessions.
        </AccessibleDisclosure>
      </section>
    </main>
  );
}