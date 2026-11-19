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
  "🌅 Safe morning hours for school & outdoor exercise",
  "🌀 Step-by-step DIY MERV-13 box-fan purifier build",
  "🍳 Gas stove indoor NO₂: Health risks & exhaust rules",
  "👶 Toddler & infant lung protection in high AQI",
  "🚗 Minimizing in-cabin PM2.5 during traffic commutes",
  "🌿 Best NASA clean-air plants for bedrooms",
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
        content: `### 🌬️ ClearAir AI Counselor Active

Welcome! I'm your interactive air quality assistant, ready to build personalized smog defenses for your family.

**Core Areas I Cover:**
- **🌅 Low-Emission Routines:** Thermal inversion avoidance for morning commutes & school drops.
- **🏠 Indoor Air Purification:** Low-cost filtration hacks, DIY fan builds, and wet-mopping protocols.
- **🍳 Stove & Kitchen Safety:** Preventing indoor nitrogen dioxide ($\text{NO}_2$) buildup from cooking.
- **🚗 Commute & Transit Defense:** Cabin air filtration and N95 masking techniques.
- **👶 High-Risk Vulnerability:** Tailored safety metrics for young children, elderly family, and asthmatics.

${
  userProfile?.familyName
    ? `> 🛡️ **Active Household:** Configured for **${userProfile.familyName}** in **${city}**.`
    : `> 📍 **Active Location:** Monitoring real-time conditions in **${city}**.`
}

Ask any question below or click a quick suggestion to generate an immediate action plan!`,
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
                      "⚠️ Temporary connection glitch. Please check your network or try again.",
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

  // Trigger from hero pills
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
    <div className="card-clean rounded-3xl bg-white flex flex-col h-[700px] shadow-sm overflow-hidden border border-slate-200">
      {/* Studio Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm shadow-xs font-bold">
            🌬️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900">AI Counselor Studio</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {userProfile?.familyName ? `Tailored for ${userProfile.familyName} in ${city}` : `Live in ${city}`}
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
            Clear Thread
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex-shrink-0 flex items-center justify-center mr-2.5 mt-1 text-xs font-extrabold border border-violet-200">
                AI
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-md"
                  : "bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-200 shadow-2xs"
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

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 overflow-x-auto flex gap-2 flex-shrink-0 scrollbar-none">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={isStreaming}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-600 font-medium transition-all shadow-2xs whitespace-nowrap disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Centerpiece Input Bar (Matching CodeDesign.ai button & card styling) */}
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your household or ask about air purification, commute safety, or cooking tips..."
            rows={2}
            disabled={isStreaming}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all resize-none disabled:opacity-50"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md flex-shrink-0"
            >
              <span>⏹</span> Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md disabled:opacity-30 flex-shrink-0 cursor-pointer"
            >
              Generate Plan ↗
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
