"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Message, UserProfile } from "@/types";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  userProfile: UserProfile | null;
  city: string;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

const QUICK_PROMPTS = [
  "🌅 Daily Routine: Safe outdoor and ventilation hours",
  "🌀 DIY Air Filter: MERV-13 box-fan build guide",
  "🍳 Gas Stove Safety: Mitigating indoor NO₂ and ultrafines",
  "👶 Kids Protection: Masking and school run protocols",
  "🚗 Car Commute: Minimizing in-cabin PM2.5 exposure",
  "😴 Night Routine: Setting purifiers for restorative sleep",
];

export default function ChatInterface({
  userProfile,
  city,
  externalPrompt,
  onClearExternalPrompt,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `### 🌬️ Welcome to ClearAir!

I'm your AI air defense companion, designed to help families navigate severe winter smog and urban pollution.

**How I can assist your household:**
- **🌅 Low-Emission Routines:** Identify thermal inversion windows to plan safer school drops & walks.
- **🏠 Indoor Air Hacks:** Low-cost filtration (DIY box-fans, wet mopping protocols, plant air purifiers).
- **🚗 Clean Transit Alternatives:** Cut personal vehicle exposure and calculate saved emissions.
- **🍳 Stove & Kitchen Safety:** Eliminate toxic indoor nitrogen dioxide from cooking burners.
- **📊 Vulnerability Guidance:** Tailored metrics for young children, elderly parents, and asthmatics.

${
  userProfile?.familyName
    ? `**Profile Loaded:** Configured for **${userProfile.familyName}** in **${city}**.`
    : `**Location Active:** Monitoring **${city || "your region"}**.`
}

Ask any question below or click a quick prompt to generate a personalized action plan!`,
        timestamp: new Date(),
      },
    ]);
  }, [userProfile?.familyName, city]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      const assistantMsgId = (Date.now() + 1).toString();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsStreaming(true);

      abortRef.current = new AbortController();

      try {
        const enrichedMessage = userProfile
          ? `[User location: ${city}] ${content}`
          : content;

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: enrichedMessage,
            previousInteractionId,
            userProfile: userProfile
              ? { ...userProfile, city }
              : { city },
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) throw new Error("Stream failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "id") {
                setPreviousInteractionId(event.id);
              } else if (event.type === "text") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: m.content + event.text }
                      : m
                  )
                );
              }
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content:
                      "⚠️ Temporary connection issue. Please check your network or API credentials.",
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, previousInteractionId, userProfile, city]
  );

  // Handle external prompts sent from hero input
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      sendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt, sendMessage, onClearExternalPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  return (
    <div className="card-subtle rounded-3xl bg-white flex flex-col h-[740px] shadow-sm overflow-hidden border border-slate-200">
      {/* Chat Sub-Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm shadow-xs font-bold">
            🌬️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900">ClearAir AI Counselor</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {userProfile?.familyName ? `Tailored for ${userProfile.familyName}` : "Adaptive Family Air Guidance"}
            </p>
          </div>
        </div>

        {messages.length > 1 && (
          <button
            onClick={() => {
              setMessages([]);
              setPreviousInteractionId(null);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex-shrink-0 flex items-center justify-center mr-3 mt-1 text-sm font-bold shadow-xs border border-violet-200">
                AI
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-3xl p-5 text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-md"
                  : "bg-slate-50/90 text-slate-800 rounded-tl-sm border border-slate-200 shadow-xs"
              }`}
            >
              {msg.role === "assistant" ? (
                msg.content ? (
                  <div className="prose-air">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 py-2 px-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                )
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 overflow-x-auto flex gap-2 flex-shrink-0 scrollbar-none">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={isStreaming}
            className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-600 font-medium transition-all shadow-2xs whitespace-nowrap disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about daily routines, indoor filtration hacks, or vehicle emissions..."
            rows={2}
            disabled={isStreaming}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all resize-none disabled:opacity-50"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md flex-shrink-0"
            >
              <span>⏹</span> Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-30 flex-shrink-0"
            >
              Send ↗
            </button>
          )}
        </form>
        <div className="mt-2 text-center text-[11px] text-slate-400">
          Enter to send · Shift+Enter for newline · Powered by Gemini 3.8 Flash
        </div>
      </div>
    </div>
  );
}
