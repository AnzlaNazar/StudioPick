"use client";

import { useState } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { Check, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import productData from "@/data/product.json";

interface ToolInvocation {
  state: "call" | "result";
  toolName: string;
  args?: Record<string, unknown>;
  result?: {
    layout: string;
    caseColor: string;
    switchType: string;
    keycapSet: string;
    addOns: string[];
    totalPrice: number;
    reasoning: Array<{ choice: string; why: string }>;
  };
}

export function BuildCard({ invocation }: { invocation: ToolInvocation }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [applied, setApplied] = useState(false);

  const applyBuild = useConfiguratorStore((s) => s.applyBuild);
  const setAdvisorOpen = useConfiguratorStore((s) => s.setAdvisorOpen);

  // State 1 & 2: Loading / Thinking state
  if (invocation.state === "call") {
    return (
      <div className="my-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3 text-neutral-600 text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
        <span>Synthesizing custom build based on your budget & preferences...</span>
      </div>
    );
  }

  const { result } = invocation;
  if (!result) return null;

  const colorHex =
    productData.options.caseColor.find((c) => c.id === result.caseColor)?.hex ?? "#3a3a3c";

  const handleApply = () => {
    applyBuild({
      layout: result.layout,
      caseColor: result.caseColor,
      switchType: result.switchType,
      keycapSet: result.keycapSet,
      addOns: result.addOns,
    });
    setApplied(true);
    setTimeout(() => {
      setAdvisorOpen(false);
    }, 400);
  };

  return (
    <div className="my-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-neutral-900">Recommended Build</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block"
            style={{ backgroundColor: colorHex }}
            title={`Case: ${result.caseColor}`}
          />
          <span className="font-mono font-bold text-base text-neutral-900">
            ${result.totalPrice}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded bg-neutral-50 border">
          <span className="text-neutral-400 block text-[10px] uppercase">Layout</span>
          <span className="font-semibold text-neutral-800">{result.layout.toUpperCase()}</span>
        </div>
        <div className="p-2 rounded bg-neutral-50 border">
          <span className="text-neutral-400 block text-[10px] uppercase">Switches</span>
          <span className="font-semibold text-neutral-800">{result.switchType}</span>
        </div>
        <div className="p-2 rounded bg-neutral-50 border">
          <span className="text-neutral-400 block text-[10px] uppercase">Keycaps</span>
          <span className="font-semibold text-neutral-800">{result.keycapSet}</span>
        </div>
        <div className="p-2 rounded bg-neutral-50 border">
          <span className="text-neutral-400 block text-[10px] uppercase">Add-ons</span>
          <span className="font-semibold text-neutral-800">
            {result.addOns.length ? result.addOns.join(", ") : "None"}
          </span>
        </div>
      </div>

      {/* FE-05 Disclosure Pattern for Reasoning */}
      <div className="border-t pt-2">
        <button
          type="button"
          aria-expanded={showReasoning}
          onClick={() => setShowReasoning(!showReasoning)}
          className="w-full flex items-center justify-between py-1 text-xs text-neutral-500 hover:text-neutral-800"
        >
          <span>Why this build?</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transform transition-transform ${
              showReasoning ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {showReasoning && (
          <div className="mt-2 space-y-1.5 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border">
            {result.reasoning.map((r, idx) => (
              <div key={idx}>
                <span className="font-semibold text-neutral-800">{r.choice}: </span>
                <span>{r.why}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action 3: Apply Build */}
      <button
        onClick={handleApply}
        disabled={applied}
        className="w-full py-2 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:bg-emerald-600"
      >
        {applied ? (
          <>
            <Check className="h-4 w-4" /> Applied to Configurator!
          </>
        ) : (
          "Apply Build"
        )}
      </button>
    </div>
  );
}