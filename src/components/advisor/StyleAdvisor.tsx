"use client";

import { BuildCard } from "./BuildCard";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { X, Send, Square, ArrowDown, Bot, User, RefreshCw } from "lucide-react";

type AdvisorToolPart = {
  type: "tool-configureProduct";
  toolCallId: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: unknown;
  output?: BuildCardInvocation["result"];
  errorText?: string;
};

type BuildCardInvocation = {
  state: "call" | "result";
  toolName: "configureProduct";
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
};

export function StyleAdvisor() {
  const isOpen = useConfiguratorStore((s) => s.isAdvisorOpen);
  const setIsOpen = useConfiguratorStore((s) => s.setAdvisorOpen);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/advisor",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const starterPrompts = [
    "Quiet office build under $190",
    "Compact tactile setup",
    "Under $160 minimal",
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleStarterPrompt = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  // Handle user scroll detection
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll when messages stream in (only if user hasn't scrolled up)
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  const closeAdvisor = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      if (!wasOpenRef.current && document.activeElement instanceof HTMLElement) {
        triggerRef.current = document.activeElement;
      }
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
      return;
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [isOpen, setIsOpen]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAdvisor();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="style-advisor-title"
        onKeyDown={handleDialogKeyDown}
        className="flex h-[100dvh] w-full min-h-0 max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-neutral-50 p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-neutral-800" aria-hidden="true" />
            <div>
              <h2 id="style-advisor-title" className="text-sm font-bold text-neutral-900">Style Advisor</h2>
              <p className="text-xs text-neutral-600">AI mechanical keyboard specialist</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <span className="sr-only" role="status" aria-live="polite">
          {error ? "The advisor could not finish the response." : isLoading ? "Analyzing build constraints..." : ""}
        </span>

        {/* Message List */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          role="log"
          aria-label="Style Advisor conversation"
          aria-live="polite"
          aria-atomic="false"
          tabIndex={0}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && (
            <div className="space-y-4 py-12 text-center text-neutral-600">
              <Bot className="mx-auto h-8 w-8 text-neutral-500" aria-hidden="true" />
              <p className="text-sm font-medium text-neutral-700">How can I help you build today?</p>
              <p className="text-xs max-w-xs mx-auto">
                Tell me your typing use-case, desk environment (quiet office, gaming), budget, or tactile preferences.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleStarterPrompt(prompt)}
                    aria-label={`Use starter prompt: ${prompt}`}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-sm ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role !== "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs text-white" aria-hidden="true">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-neutral-900 text-white rounded-br-none"
                    : "bg-neutral-100 text-neutral-800 rounded-bl-none"
                }`}
              >
                {/* Render Text Parts */}
                {m.parts
                  ?.filter((part) => part.type === "text")
                  .map((part, index) => (
                    <span key={`${m.id}-text-${index}`}>{part.text}</span>
                  ))}

                {/* Render the current AI SDK tool-part shape through BuildCard's view model. */}
                {m.parts
                  ?.filter((part) => part.type === "tool-configureProduct")
                  .map((part) => {
                    const toolPart = part as unknown as AdvisorToolPart;
                    if (toolPart.state === "output-error") return null;

                    const invocation: BuildCardInvocation =
                      toolPart.state === "output-available"
                        ? {
                            state: "result",
                            toolName: "configureProduct",
                            args: typeof toolPart.input === "object" && toolPart.input !== null
                              ? (toolPart.input as Record<string, unknown>)
                              : undefined,
                            result: toolPart.output,
                          }
                        : {
                            state: "call",
                            toolName: "configureProduct",
                            args: typeof toolPart.input === "object" && toolPart.input !== null
                              ? (toolPart.input as Record<string, unknown>)
                              : undefined,
                          };

                    return (
                      <BuildCard
                        key={toolPart.toolCallId}
                        invocation={invocation}
                      />
                    );
                  })}
              </div>
              {m.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs text-neutral-700" aria-hidden="true">
                  <User className="h-4 w-4" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3 text-sm justify-start items-center text-neutral-400">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs text-white" aria-hidden="true">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-xs animate-pulse">Analyzing build constraints...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-950">
              <div>
                <p className="font-semibold">The advisor could not finish that response.</p>
                <p className="mt-1 text-rose-800">Your conversation is still here. Please try again.</p>
              </div>
              <button
                type="button"
                onClick={() => regenerate()}
                aria-label="Retry advisor response"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-2 font-semibold text-rose-900 shadow-sm ring-1 ring-inset ring-rose-200 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-900 focus-visible:ring-offset-2"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Jump to latest button */}
        {!isAtBottom && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={scrollToBottom}
              aria-label="Jump to latest message"
              className="flex items-center gap-1 rounded-full bg-neutral-800 px-3 py-1.5 text-xs text-white shadow hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <ArrowDown className="h-3 w-3" aria-hidden="true" /> Jump to latest
            </button>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="shrink-0 space-y-2 border-t bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message the Style Advisor"
              placeholder="e.g. Quiet switches for open office, budget $200..."
              rows={2}
              className="flex-1 resize-none rounded-lg border p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="flex items-center justify-center rounded-lg bg-rose-600 px-4 text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-900 focus-visible:ring-offset-2"
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center rounded-lg bg-neutral-900 px-4 text-white hover:bg-neutral-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}