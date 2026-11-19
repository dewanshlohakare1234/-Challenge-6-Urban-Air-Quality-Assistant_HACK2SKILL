"use client";

import { useState, useEffect, useRef } from "react";
import AQIWidget from "@/components/AQIWidget";
import ChatInterface from "@/components/ChatInterface";
import ProfileSetup from "@/components/ProfileSetup";
import QuickTips from "@/components/QuickTips";
import { UserProfile } from "@/types";

const HERO_SUGGESTIONS = [
  "🌅 Safe morning hours for school runs and walks",
  "🌀 How to build a DIY MERV-13 air purifier box fan",
  "🍳 Gas stove vs Induction: Health impact of indoor NO₂",
  "👶 Masking guidelines for toddlers and young children",
  "🚗 Best AC recirculation settings for car commutes",
];

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [city, setCity] = useState("Delhi");
  const [heroInput, setHeroInput] = useState("");
  const [triggeredPrompt, setTriggeredPrompt] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("clearair-profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setCity(parsed.city || "Delhi");
      } catch {}
    }
    setIsLoaded(true);
  }, []);

  const handleProfileSave = (p: UserProfile) => {
    setProfile(p);
    setCity(p.city || "Delhi");
    localStorage.setItem("clearair-profile", JSON.stringify(p));
    setShowProfileSetup(false);
  };

  const handleHeroSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!heroInput.trim()) return;

    setTriggeredPrompt(heroInput);
    setHeroInput("");
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChipClick = (suggestion: string) => {
    setTriggeredPrompt(suggestion);
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-950 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="bg-rose-500 text-white text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded">
          Alert
        </span>
        <span className="text-slate-300">
          Severe Winter Smog Alert active across Northern India, Pakistan & East Asia.
        </span>
        <button
          onClick={() => {
            setTriggeredPrompt("What emergency actions should my family take during severe winter smog alerts?");
            dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer ml-1"
        >
          View Action Plan →
        </button>
      </div>

      {/* 2. Main Hero with Purple Gradient Backdrop (Matching CodeDesign.ai Vibe!) */}
      <section className="hero-gradient text-white pb-24 pt-6 px-4 md:px-8 relative overflow-hidden">
        {/* Navigation Bar */}
        <div className="max-w-6xl mx-auto flex items-center justify-between pb-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-lg">
              🌬️
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">ClearAir<span className="text-indigo-300">.ai</span></span>
              <span className="hidden sm:inline-block text-[11px] text-purple-200 ml-2 font-medium">
                Family Air Defense
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-purple-100">
            <a href="#dashboard" className="hover:text-white transition-colors">Live AQI</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Indoor Hacks</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Daily Routines</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Commute Calculator</a>
          </nav>

          {/* User Profile CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-purple-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{city}</span>
            </div>

            <button
              onClick={() => setShowProfileSetup(true)}
              className="px-4 py-2 rounded-full bg-white text-indigo-900 hover:bg-purple-50 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{profile ? "🛡️ Shield Active" : "⚙️ Setup Profile"}</span>
            </button>
          </div>
        </div>

        {/* Hero Copy & Badge */}
        <div className="max-w-4xl mx-auto text-center space-y-5 pt-4">
          {/* Social Proof Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs text-purple-100 shadow-md">
            <div className="flex -space-x-1.5 overflow-hidden">
              <span className="inline-block w-5 h-5 rounded-full bg-indigo-300 text-[10px] text-indigo-900 font-bold flex items-center justify-center border border-white">👨‍👩‍👧</span>
              <span className="inline-block w-5 h-5 rounded-full bg-purple-300 text-[10px] text-purple-900 font-bold flex items-center justify-center border border-white">👵</span>
              <span className="inline-block w-5 h-5 rounded-full bg-pink-300 text-[10px] text-pink-900 font-bold flex items-center justify-center border border-white">👶</span>
            </div>
            <span className="font-semibold text-white">45,000+ families</span>
            <span className="text-purple-200">protected across 40+ smog cities</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Smart Winter Smog & <br />
            Air Quality Assistant
          </h1>

          {/* Subtitle */}
          <p className="text-purple-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Personalized low-emission daily routines, indoor purification hacks, and real-time AQI defense designed specifically for your household.
          </p>
        </div>

        {/* 3. The Iconic Centerpiece White Prompt Card (CodeDesign.ai style!) */}
        <div className="max-w-3xl mx-auto mt-8">
          <form
            onSubmit={handleHeroSubmit}
            className="bg-white rounded-3xl p-5 md:p-6 shadow-2xl hero-card-glow text-slate-800 transition-all border border-purple-100"
          >
            {/* Input Textarea */}
            <div className="relative">
              <textarea
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleHeroSubmit();
                  }
                }}
                rows={3}
                placeholder="Describe your household (e.g., 'Family in Delhi with a 3-year-old and asthmatic grandparent. We cook on gas and commute by car...') or ask any smog question..."
                className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent"
              />
            </div>

            {/* Quick Suggestion Chips inside Card */}
            <div className="pt-2 pb-4 flex flex-wrap gap-1.5 border-b border-slate-100">
              {HERO_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChipClick(s)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Bottom Bar: Location Selector + Action CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
                <span className="font-semibold text-slate-700">Target Location:</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                  📍 {city}
                </span>
                {profile?.familyName && (
                  <span className="text-indigo-600 font-medium">({profile.familyName})</span>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400">
                  {heroInput.length}/1,000
                </span>
                <button
                  type="submit"
                  disabled={!heroInput.trim()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                >
                  <span>Generate Action Plan</span>
                  <span className="text-base leading-none">↗</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 4. Interactive Dashboard Section */}
      <section id="dashboard" ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-16 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Real-Time Air Metrics & Science Hacks */}
          <div className="lg:col-span-1 space-y-6">
            <AQIWidget city={city} onCityChange={setCity} />
            <QuickTips />
          </div>

          {/* Right Column: AI Assistant Counselor Thread */}
          <div className="lg:col-span-2">
            <ChatInterface
              userProfile={profile}
              city={city}
              externalPrompt={triggeredPrompt}
              onClearExternalPrompt={() => setTriggeredPrompt("")}
            />
          </div>
        </div>
      </section>

      {/* 5. Minimalist Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span>🌬️ ClearAir.ai</span>
            <span className="text-slate-400 font-normal">| GenAI Urban Air Quality Companion</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <span>WHO Air Guidelines</span>
            <span>NASA Clean Air Study</span>
            <span>EPA PM2.5 Standards</span>
          </div>

          <p className="text-slate-400">
            Powered by Google Gemini 3.8 Flash · 100% On-Device Privacy
          </p>
        </div>
      </footer>

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetup
          initial={profile}
          onSave={handleProfileSave}
          onClose={() => setShowProfileSetup(false)}
        />
      )}
    </div>
  );
}
