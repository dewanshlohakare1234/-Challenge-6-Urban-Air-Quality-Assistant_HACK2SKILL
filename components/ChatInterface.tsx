'use client';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

interface Props {
  activePrompt: string;
  onPromptConsumed: () => void;
  city: string;
  profile: { name: string; city: string } | null;
}

const QUICK_PROMPTS = [
  '🌅 Safe hours for morning walks?',
  '🔧 DIY air purifier guide',
  '🍳 Gas stove NO₂ risks',
  '😷 Best masks for kids',
  '🚗 Car AC tips in smog',
];

export default function ChatInterface({ activePrompt, onPromptConsumed, city, profile }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Welcome message
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `## 🌬️ Welcome to ClearAir!

I'm your AI-powered air quality companion, here to help your family breathe easier.

**Here's how I can help:**
- 🌅 Build low-emission morning routines
- 🏠 Improve your indoor air quality
- 🚌 Find cleaner commuting alternatives
- 🍳 Cook with less indoor pollution
- 📊 Understand what AQI numbers mean for your family

${profile ? `**Profile Loaded:** Configured for **${profile.name}** in **${profile.city}**.` : `I can see you're in **${city}**. Ask me anything about managing air quality in your daily life — I'll give you practical, science-backed advice tailored to your situation.`}

> 💡 **Quick Win:** Right now, close any windows if outdoor AQI > 150 and turn on any air purifier you have.`,
    }]);
  }, [city, profile]);

  // Handle incoming activePrompt from hero chips
  useEffect(() => {
    if (activePrompt) {
      setInput(activePrompt);
      onPromptConsumed();
      setTimeout(() => sendMessage(activePrompt), 100);
    }
  }, [activePrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const assistantMsg: Message = { role: 'assistant', content: '', streaming: true };
    setMessages([...updatedMessages, assistantMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          city,
          profile,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  full += data.text;
                  setMessages(prev => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: 'assistant', content: full, streaming: true };
                    return copy;
                  });
                }
              } catch {}
            }
          }
        }
      }

      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content: full || 'I encountered an issue. Please try again.', streaming: false };
        return copy;
      });
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: `I'm having trouble connecting right now. For **${city}** with current AQI levels, here are some immediate tips:\n\n- 🏠 Keep windows closed and use recirculated AC\n- 😷 Wear N95/KN95 masks if going outdoors\n- 🌿 Place air-purifying plants indoors\n- 💧 Stay hydrated to help your body clear particles`,
          streaming: false,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
      border: '1px solid #ede9fe',
      display: 'flex', flexDirection: 'column',
      height: 680,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid #f3f0ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>ClearAir AI Counselor</div>
            <div style={{ fontSize: 12, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Gemini 3.8 Flash · {profile ? `Tailored for ${profile.name}` : `Monitoring ${city}`}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([]);
            setTimeout(() => setMessages([{
              role: 'assistant',
              content: `## 🌬️ New session started!\n\nI'm ready to help you with air quality questions for **${city}**. What would you like to know?`,
            }]), 100);
          }}
          style={{
            background: '#f3f0ff', border: 'none', borderRadius: 8,
            padding: '6px 12px', fontSize: 12, color: '#7c3aed', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Clear Thread
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 10, alignItems: 'flex-start',
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#fff', fontWeight: 700,
            }}>
              {msg.role === 'user' ? (profile?.name[0]?.toUpperCase() || 'U') : '🤖'}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '78%',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                : '#f8f7ff',
              color: msg.role === 'user' ? '#fff' : '#1a1a2e',
              borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
              padding: '12px 16px',
              fontSize: 14, lineHeight: 1.65,
              boxShadow: msg.role === 'user'
                ? '0 4px 12px rgba(124,58,237,0.25)'
                : '0 2px 8px rgba(0,0,0,0.06)',
              border: msg.role === 'assistant' ? '1px solid #ede9fe' : 'none',
            }}>
              {msg.role === 'assistant' ? (
                <div className="ai-prose">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.streaming && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  )}
                </div>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>🤖</div>
            <div style={{
              background: '#f8f7ff', border: '1px solid #ede9fe',
              borderRadius: '4px 18px 18px 18px',
              padding: '12px 16px',
              display: 'flex', gap: 4,
            }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div style={{
        padding: '10px 20px 0',
        display: 'flex', gap: 8, overflowX: 'auto',
        borderTop: '1px solid #f3f0ff',
      }}>
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            style={{
              flexShrink: 0,
              background: '#f3f0ff', border: '1px solid #ddd6fe',
              borderRadius: 999, padding: '5px 12px',
              fontSize: 12, color: '#5b21b6', fontWeight: 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = '#7c3aed';
              (e.target as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = '#f3f0ff';
              (e.target as HTMLButtonElement).style.color = '#5b21b6';
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        padding: '14px 20px 20px',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your household or ask about air quality, routines, indoor tips…"
          rows={2}
          style={{
            flex: 1, resize: 'none',
            border: '1.5px solid #ddd6fe',
            borderRadius: 14, padding: '10px 14px',
            fontSize: 14, fontFamily: 'Inter, sans-serif',
            color: '#1a1a2e', background: '#faf5ff',
            outline: 'none',
            transition: 'border-color 0.2s',
            lineHeight: 1.5,
          }}
          onFocus={e => (e.target.style.borderColor = '#7c3aed')}
          onBlur={e => (e.target.style.borderColor = '#ddd6fe')}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 46, height: 46,
            borderRadius: 12,
            background: input.trim() && !loading
              ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
              : '#e5e7eb',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, transition: 'all 0.2s',
            boxShadow: input.trim() && !loading ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
          }}
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>

      <div style={{
        textAlign: 'center', fontSize: 11, color: '#9ca3af',
        paddingBottom: 12,
      }}>
        Enter to send · Shift+Enter for new line · Powered by Gemini 3.8 Flash
      </div>
    </div>
  );
}
