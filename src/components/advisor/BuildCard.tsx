"use client";

import { useState } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { AlertTriangle, Check, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import productData from "@/data/product.json";

interface ToolInvocation {
  state: "call" | "result";
  toolName: string;
  args?: Record<string, unknown>;
  result?: {
    insufficientBudget?: boolean;
    minRequired?: number;
    layout?: string;
    caseColor?: string;
    switchType?: string;
    keycapSet?: string;
    addOns?: string[];
    totalPrice?: number;
    reasoning: Array<{ choice: string; why: string }>;
  };
}

export function BuildCard({ invocation }: { invocation: ToolInvocation }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [applied, setApplied] = useState(false);
  const applyBuild = useConfiguratorStore((s) => s.applyBuild);
  const setAdvisorOpen = useConfiguratorStore((s) => s.setAdvisorOpen);

  if (invocation.state === "call") {
    return (
      <div className="my-3 flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
        <span>Synthesizing custom build based on your budget & preferences...</span>
      </div>
    );
  }

  const { result } = invocation;
  if (!result) return null;

  if (result.insufficientBudget) {
    return (
      <div className="my-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-semibold">Budget below minimum starting build (${result.minRequired ?? 149}).</p>
          <p>Please increase target budget.</p>
        </div>
      </div>
    );
  }

  if (!result.layout || !result.caseColor || !result.switchType || !result.keycapSet || !result.addOns || result.totalPrice === undefined) {
    return null;
  }

  const { layout, caseColor, switchType, keycapSet, addOns } = result;
  const colorHex = productData.options.caseColor.find((option) => option.id === caseColor)?.hex ?? "#3a3a3c";

  const handleApply = () => {
    applyBuild({ layout, caseColor, switchType, keycapSet, addOns });
    setApplied(true);
    setTimeout(() => setAdvisorOpen(false), 400);
  };

  return (
    <div className="my-4 space-y-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /><h3 className="text-sm font-bold text-neutral-900">Recommended Build</h3></div>
        <div className="flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rounded-full border border-neutral-300" style={{ backgroundColor: colorHex }} title={`Case: ${caseColor}`} /><span className="font-mono text-base font-bold text-neutral-900">${result.totalPrice}</span></div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border bg-neutral-50 p-2"><span className="block text-[10px] uppercase text-neutral-400">Layout</span><span className="font-semibold text-neutral-800">{layout.toUpperCase()}</span></div>
        <div className="rounded border bg-neutral-50 p-2"><span className="block text-[10px] uppercase text-neutral-400">Switches</span><span className="font-semibold text-neutral-800">{switchType}</span></div>
        <div className="rounded border bg-neutral-50 p-2"><span className="block text-[10px] uppercase text-neutral-400">Keycaps</span><span className="font-semibold text-neutral-800">{keycapSet}</span></div>
        <div className="rounded border bg-neutral-50 p-2"><span className="block text-[10px] uppercase text-neutral-400">Add-ons</span><span className="font-semibold text-neutral-800">{addOns.length ? addOns.join(", ") : "None"}</span></div>
      </div>
      <div className="border-t pt-2">
        <button type="button" aria-expanded={showReasoning} onClick={() => setShowReasoning(!showReasoning)} className="flex w-full items-center justify-between py-1 text-xs text-neutral-500 hover:text-neutral-800"><span>Why this build?</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${showReasoning ? "rotate-180" : ""}`} /></button>
        {showReasoning && <div className="mt-2 space-y-1.5 rounded border bg-neutral-50 p-2.5 text-xs text-neutral-600">{result.reasoning.map((reason) => <div key={reason.choice}><span className="font-semibold text-neutral-800">{reason.choice}: </span><span>{reason.why}</span></div>)}</div>}
      </div>
      <button type="button" onClick={handleApply} disabled={applied} className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 disabled:bg-emerald-600">{applied ? <><Check className="h-4 w-4" /> Applied to Configurator!</> : "Apply Build"}</button>
    </div>
  );
}
