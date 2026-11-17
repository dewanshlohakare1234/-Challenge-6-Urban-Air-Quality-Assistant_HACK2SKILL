# ClearAir 🌬️

**A GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution.**

Built with **Next.js 15**, **Gemini 3.8 Flash**, and the latest `@google/genai` SDK.

---

## ✨ Features

- 🤖 **Smart AI Chat** — Context-aware assistant powered by Gemini 3.8 Flash with streaming responses and multi-turn memory
- 📊 **Live AQI Widget** — Real-time air quality data for any city using WAQI API (falls back to realistic demo data)
- 👨‍👩‍👧 **Family Profile** — Personalized advice based on family composition, lifestyle, cooking habits, and commute
- 🌅 **Categorized Guidance** — Advice organized by Morning Routine, Indoor Air, Commute, Cooking, and Night & Sleep
- ⚡ **Quick Tips Panel** — Science-backed daily hacks always visible on screen
- 🌍 **Location-aware** — Tailored to your city's specific pollution challenges

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/clearair.git
cd clearair
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
│   ├── page.tsx              # Main page (3-column layout)
│   └── globals.css
├── components/
│   ├── AQIWidget.tsx         # Real-time AQI display with gauge
│   ├── ChatInterface.tsx     # Streaming chat with markdown rendering
│   ├── ProfileSetup.tsx      # 3-step family profile wizard
│   └── QuickTips.tsx         # Static science-backed tips panel
└── types/
    └── index.ts              # Shared TypeScript types
```

### Key Technical Decisions

| Decision | Why |
|---|---|
| **Gemini 3.8 Flash** | Fast, balanced performance ideal for chat with 1M context |
| **Streaming SSE** | Real-time token streaming for better UX |
| **Stateful conversations** | `previous_interaction_id` for multi-turn memory |
| **Local profile storage** | Privacy-first — no user data sent to any server |
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

- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini 3.8 Flash via `@google/genai` SDK
- **Styling**: Tailwind CSS v4
- **Air Quality Data**: WAQI API
- **Language**: TypeScript
- **Deployment**: Vercel-ready

---

## 📄 License

MIT
