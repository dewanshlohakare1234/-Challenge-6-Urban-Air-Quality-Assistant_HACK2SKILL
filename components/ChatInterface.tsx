"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Message, UserProfile } from "@/types";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  userProfile: UserProfile | null;
  city: string;
}

const SUGGESTED_PROMPTS = [
  "🏠 How can I improve indoor air quality at home?",
  "🚗 What are low-emission alternatives for my commute?",
  "🍳 How does cooking on gas affect indoor air quality?",
  "😷 Should my kids wear masks today?",
  "🌱 What plants help purify indoor air?",
  "🌙 How can I sleep better during high pollution nights?",
  "📊 Explain the AQI scale for my family",
  "⚡ Compare electric vs gas cooking for air quality",
];

export default function ChatInterface({ userProfile, city }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `# 👋 Welcome to ClearAir!

I'm your AI-powered air quality companion, here to help your family breathe easier.

**Here's how I can help:**
- 🌅 Build low-emission morning routines
- 🏠 Improve your indoor air quality
- 🚗 Find cleaner commuting alternatives
- 🍳 Cook with less indoor pollution
- 📊 Understand what AQI numbers mean for your family

**${city ? `I can see you're in ${city}.` : "Tell me your city"}** Ask me anything about managing air quality in your daily life — I'll give you practical, science-backed advice tailored to your situation.

> 💡 **Quick Win:** Right now, close any windows if outdoor AQI > 150 and turn on any air purifier you have.`,
        timestamp: new Date(),
      },
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          ? `[User is in ${city}] ${content}`
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
                      "⚠️ I encountered an issue. Please check your API key and try again.",
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
    <div
      className="rounded-2xl border border-slate-800 flex flex-col"
      style={{ background: "var(--card)", height: "calc(100vh - 160px)", minHeight: "500px" }}
    >
      {/* Chat Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">
            ClearAir Assistant
            {userProfile?.familyName && (
              <span className="text-slate-500 ml-1">· {userProfile.familyName}</span>
            )}
          </span>
        </div>
        {previousInteractionId && (
          <button
            onClick={() => {
              setMessages([]);
              setPreviousInteractionId(null);
            }}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            New Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mr-2 mt-1 text-sm"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
                🌬️
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "text-slate-200 rounded-tl-sm border border-slate-700/50"
              }`}
              style={
                msg.role === "user"
                  ? { background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }
                  : { background: "rgba(15,23,42,0.8)" }
              }
            >
              {msg.role === "assistant" ? (
                msg.content ? (
                  <div className="prose-dark">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 py-1">
                    <span className="typing-dot w-2 h-2 rounded-full bg-sky-400 inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-sky-400 inline-block" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-sky-400 inline-block" />
                  </div>
                )
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="flex-shrink-0 text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:border-sky-600 hover:text-sky-400 transition-all whitespace-nowrap"
              style={{ background: "rgba(15,23,42,0.6)" }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about air quality, routines, indoor tips..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-slate-900 text-sm text-white rounded-xl px-4 py-3 border border-slate-700 focus:border-sky-500 focus:outline-none placeholder:text-slate-500 resize-none transition-colors disabled:opacity-50"
            style={{ maxHeight: "120px" }}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="px-4 py-3 rounded-xl text-white text-sm font-medium transition-all bg-red-600 hover:bg-red-700 flex-shrink-0"
            >
              ⏹
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-30 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            >
              ➤
            </button>
          )}
        </form>
        <p className="text-xs text-slate-600 mt-2 text-center">
          Shift+Enter for new line · Enter to send · Powered by Gemini 3.8 Flash
        </p>
      </div>
    </div>
  );
}
