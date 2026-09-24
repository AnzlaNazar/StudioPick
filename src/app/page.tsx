"use client";

import dynamic from "next/dynamic";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useEffect, useRef, useSyncExternalStore } from "react";

const StyleAdvisor = dynamic(
  () => import("@/components/advisor/StyleAdvisor").then((module) => module.StyleAdvisor),
  { ssr: false },
);

export default function Home() {
  const advisorTriggerRef = useRef<HTMLButtonElement>(null);
  const advisorWasOpenRef = useRef(false);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const { layout, caseColor, switchType, computedPrice, isAdvisorOpen, setAdvisorOpen } =
    useConfiguratorStore();

  useEffect(() => {
    if (isAdvisorOpen) {
      advisorWasOpenRef.current = true;
    } else if (advisorWasOpenRef.current) {
      advisorWasOpenRef.current = false;
      advisorTriggerRef.current?.focus();
    }
  }, [isAdvisorOpen]);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-between">
      <header className="border-b bg-white p-4 font-semibold text-lg">
        The Forge — Custom Mechanical Keyboard
      </header>

      <main id="main-content" className="mx-auto w-full max-w-4xl space-y-6 p-6">
        {/* Placeholder 1: Product Stage */}
        <section className="border-2 border-dashed border-neutral-300 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-bold mb-1">Product Stage</h2>
          <p className="text-sm text-neutral-500">
            Interactive visual representation of the keyboard will render here.
          </p>
          {mounted && (
            <div className="mt-4 p-3 bg-neutral-50 rounded text-xs font-mono space-y-1 border">
              <div>Current Layout: <span className="font-semibold">{layout}</span></div>
              <div>Current Case: <span className="font-semibold">{caseColor}</span></div>
              <div>Current Switch: <span className="font-semibold">{switchType}</span></div>
            </div>
          )}
        </section>

        {/* Placeholder 2: Configuration Steps */}
        <section className="border-2 border-dashed border-neutral-300 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-bold mb-1">Configuration Steps</h2>
          <p className="text-sm text-neutral-500">
            Step-by-step pickers for layout, switches, keycaps, and accessories.
          </p>
        </section>

        {/* Placeholder 3: Style Advisor Trigger */}
        <section className="border-2 border-dashed border-neutral-300 rounded-lg p-6 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Style Advisor Trigger</h2>
            <p className="text-sm text-neutral-500">
              Need advice? Let the AI recommend a configuration based on your desk setup.
            </p>
          </div>
          <button
            ref={advisorTriggerRef}
            type="button"
            onClick={() => setAdvisorOpen(true)}
            aria-label="Open Style Advisor"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Open Style Advisor
          </button>
        </section>
      </main>

      {/* Placeholder 4: Sticky Summary Bar */}
      <footer className="sticky bottom-0 border-t bg-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Sticky Summary Bar</h3>
            <p className="text-xs text-neutral-500">Live total & cart action</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">
              ${mounted ? computedPrice() : "..."}
            </span>
            <button type="button" aria-label="Add current build to bag" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
              Add to Bag
            </button>
          </div>
        </div>
      </footer>

      {/* Style Advisor Chat Drawer */}
      {isAdvisorOpen && <StyleAdvisor />}
    </div>
  );
}