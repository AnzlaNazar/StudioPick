"use client";

import { useConfiguratorStore } from "@/store/configuratorStore";
import { StyleAdvisor } from "@/components/advisor/StyleAdvisor";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { layout, caseColor, switchType, computedPrice, setAdvisorOpen } =
    useConfiguratorStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-between">
      <header className="border-b bg-white p-4 font-semibold text-lg">
        The Forge — Custom Mechanical Keyboard
      </header>

      <main className="max-w-4xl mx-auto w-full p-6 space-y-6">
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
            onClick={() => setAdvisorOpen(true)}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800"
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
            <button className="px-4 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800">
              Add to Bag
            </button>
          </div>
        </div>
      </footer>

      {/* Style Advisor Chat Drawer */}
      <StyleAdvisor />
    </div>
  );
}