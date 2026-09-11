"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { X, Send, Square, ArrowDown, Bot, User } from "lucide-react";

export function StyleAdvisor() {
  const isOpen = useConfiguratorStore((s) => s.isAdvisorOpen);
  const setIsOpen = useConfiguratorStore((s) => s.setAdvisorOpen);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/advisor",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
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

  // Trap Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Style Advisor Chat"
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-neutral-800" />
            <div>
              <h2 className="font-bold text-sm text-neutral-900">Style Advisor</h2>
              <p className="text-xs text-neutral-500">AI mechanical keyboard specialist</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message List */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          aria-live="polite"
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && (
            <div className="text-center py-12 text-neutral-500 space-y-2">
              <Bot className="h-8 w-8 mx-auto text-neutral-400" />
              <p className="text-sm font-medium text-neutral-700">How can I help you build today?</p>
              <p className="text-xs max-w-xs mx-auto">
                Tell me your typing use-case, desk environment (quiet office, gaming), budget, or tactile preferences.
              </p>
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
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-neutral-900 text-white rounded-br-none"
                    : "bg-neutral-100 text-neutral-800 rounded-bl-none"
                }`}
              >
                {m.parts
                  .filter((part) => part.type === "text")
                  .map((part, index) => (
                    <span key={`${m.id}-part-${index}`}>{part.text}</span>
                  ))}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 text-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3 text-sm justify-start items-center text-neutral-400">
              <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 text-xs">
                <Bot className="h-4 w-4" />
              </div>
              <span className="text-xs animate-pulse">Analyzing build constraints...</span>
            </div>
          )}
        </div>

        {/* Jump to latest button */}
        {!isAtBottom && (
          <div className="flex justify-center pb-2">
            <button
              onClick={scrollToBottom}
              className="flex items-center gap-1 text-xs bg-neutral-800 text-white px-3 py-1.5 rounded-full shadow hover:bg-neutral-700"
            >
              <ArrowDown className="h-3 w-3" /> Jump to latest
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="p-4 border-t bg-white space-y-2">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Quiet switches for open office, budget $200..."
              rows={2}
              className="flex-1 resize-none border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
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
                className="px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center"
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}