# ClearAir 🌬️

> **A GenAI-powered assistant that helps families navigate severe winter smog and urban air pollution.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-7c3aed?style=for-the-badge)](https://challenge6hack2skill.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini](https://img.shields.io/badge/Gemini_3.8_Flash-AI_Powered-4f46e5?style=for-the-badge)](https://ai.google.dev)

---

## 🌐 Live Demo

**👉 [https://challenge6hack2skill.vercel.app/](https://challenge6hack2skill.vercel.app/)**

---

## ✨ Features

- 🤖 **Smart AI Chat** — Context-aware assistant powered by Gemini 3.8 Flash with streaming responses and multi-turn memory
- 📊 **Live AQI Widget** — Real-time air quality data for any city using WAQI API (falls back to realistic demo data)
- 👨‍👩‍👧 **Family Profile** — Personalized advice based on family composition, lifestyle, cooking habits, and commute
- 🌅 **Categorized Guidance** — Advice organized by Morning Routine, Indoor Air, Commute, Cooking, and Night & Sleep
- ⚡ **Quick Tips Panel** — Science-backed daily hacks always visible on screen
- 🌍 **Location-aware** — Tailored to your city's specific pollution challenges
- 💜 **Clean Modern UI** — Purple gradient hero, white card layout, fully responsive

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dewanshlohakare1234/-Challenge-6-Urban-Air-Quality-Assistant_HACK2SKILL.git
cd -Challenge-6-Urban-Air-Quality-Assistant_HACK2SKILL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up API keys
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
WAQI_API_KEY=your_waqi_api_key_here   # Optional — for live AQI data
```

**Get your keys:**
- **Gemini API key** → [Google AI Studio](https://aistudio.google.com/apikey)
- **WAQI API key** → [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/) (free)

> **Note:** The app works without API keys — it uses smart simulated responses for demos.

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture

```
clearair/
├── app/
│   ├── api/
│   │   ├── chat/route.ts     # Gemini streaming chat endpoint
│   │   └── aqi/route.ts      # Air quality data endpoint
│   ├── layout.tsx
│   ├── page.tsx              # Main page with hero + dashboard
│   └── globals.css
├── components/
│   ├── AQIWidget.tsx         # Real-time AQI display with gauge
│   ├── ChatInterface.tsx     # Streaming chat with markdown rendering
│   ├── ProfileSetup.tsx      # 3-step family profile wizard
│   └── QuickTips.tsx         # Science-backed tips panel
└── types/
    └── index.ts              # Shared TypeScript types
```

### Key Technical Decisions

| Decision | Why |
|---|---|
| **Gemini 3.8 Flash** | Fast, balanced performance ideal for chat with 1M context |
| **Streaming SSE** | Real-time token streaming for better UX |
| **Multi-turn memory** | Full conversation history passed on each request |
| **Local profile storage** | Privacy-first — no user data sent to any server |
| **Inline styles** | Zero CSS framework conflicts — works reliably across all environments |
| **WAQI API** | Free tier covers all major polluted cities globally |

---

## 🧠 AI Assistant Capabilities

The ClearAir assistant is specialized to:

1. **Understand your context** — family profile, city, lifestyle, season
2. **Give categorized advice** across 5 life domains:
   - 🌅 Morning Routine
   - 🏠 Indoor Air Quality
   - 🚗 Commute
   - 🍳 Cooking
   - 😴 Night & Sleep
3. **Quantify impact** — "switching reduces PM2.5 exposure by ~40%"
4. **Explain AQI** for different family members (children, elderly, pregnant)
5. **Always end with a Quick Win** — one immediate action

---

## 🌍 Challenge Vertical

**Family & Community Health** — Helping families in high-pollution urban environments (Delhi, Beijing, Lahore, Dhaka, etc.) make informed, sustainable decisions in their daily lives.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **AI Model** | Google Gemini 3.8 Flash |
| **AI SDK** | `@google/genai` v2.32.0 |
| **Air Quality** | WAQI API |
| **Language** | TypeScript |
| **Styling** | CSS with inline React styles |
| **Deployment** | Vercel |

---

## 📄 License

MIT
