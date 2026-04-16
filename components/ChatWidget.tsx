"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { rickOpeningMessage } from "@/lib/rick-prompt";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export default function ChatWidget() {
  const { messages, sendMessage, status } = useChat({ transport });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  // Auto-open on page load after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      if (!open) handleOpen();
      sendMessage({ text: text.trim() });
      setInput("");
    },
    [open, isLoading, sendMessage, handleOpen]
  );

  // Exposed via ref-like pattern for parent to trigger "Learn More"
  // We use a global callback instead
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__rickChat = (projectTitle: string) => {
      handleOpen();
      // Small delay so the panel renders first
      setTimeout(() => {
        sendMessage({ text: `Tell me about ${projectTitle}` });
      }, 300);
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__rickChat;
    };
  }, [handleOpen, sendMessage]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0A66C2] text-white shadow-lg hover:bg-[#004182] transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Open chat with Rick"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <span className="absolute inset-0 rounded-full bg-[#0A66C2] animate-ping opacity-30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#0A66C2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  R
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Rick</p>
                  <p className="text-xs text-white/70">Portfolio Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Rick opening message */}
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  R
                </div>
                <div className="bg-[#F4F2EE] rounded-lg rounded-tl-none px-3 py-2 text-sm text-[#191919] max-w-[85%]">
                  {rickOpeningMessage}
                </div>
              </div>

              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 items-start ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                        R
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
                        isUser
                          ? "bg-[#0A66C2] text-white rounded-tr-none"
                          : "bg-[#F4F2EE] text-[#191919] rounded-tl-none"
                      }`}
                    >
                      {msg.parts.map((part, i) =>
                        part.type === "text" ? (
                          <span key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                    R
                  </div>
                  <div className="bg-[#F4F2EE] rounded-lg rounded-tl-none px-3 py-2 text-sm text-[#666]">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="border-t border-gray-200 px-4 py-3 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Rick anything..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-[#191919] placeholder:text-gray-400 focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 text-sm font-medium bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
