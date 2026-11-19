"use client";

import { useState, useEffect } from "react";
import AQIWidget from "@/components/AQIWidget";
import ChatInterface from "@/components/ChatInterface";
import ProfileSetup from "@/components/ProfileSetup";
import QuickTips from "@/components/QuickTips";
import { UserProfile } from "@/types";

const HERO_PILLS = [
  "🌅 Safe morning hours for school & walks",
  "🌀 DIY MERV-13 air purifier box-fan guide",
  "🍳 Gas stove vs Induction: NO₂ health impact",
  "👶 Masking guidelines for toddlers",
  "🚗 Car AC recirculation in heavy smog",
];

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [city, setCity] = useState("Delhi");
  const [triggeredPrompt, setTriggeredPrompt] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* 1. Global Alert Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="bg-rose-500 text-white text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded">
          Winter Alert
        </span>
        <span className="text-slate-300">
          Severe Smog Season active across major urban centers.
        </span>
        <button
          onClick={() => setTriggeredPrompt("What emergency actions should my family take during severe winter smog alerts?")}
          className="text-indigo-300 hover:text-white underline font-semibold cursor-pointer ml-1"
        >
          View Action Plan →
        </button>
      </div>

      {/* 2. Sleek Sticky Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-lg text-white shadow-sm font-bold">
              🌬️
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                ClearAir<span className="text-indigo-600">.ai</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium ml-2">
                Urban Air Defense
              </span>
            </div>
          </div>

          {/* Center Badges */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitoring: {city}</span>
            </div>
            {profile?.familyName && (
              <span className="text-xs text-indigo-600 font-medium">
                Shield Active for {profile.familyName}
              </span>
            )}
          </div>

          {/* Right Action */}
          <button
            onClick={() => setShowProfileSetup(true)}
            className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{profile ? "🛡️ Edit Family Shield" : "⚙️ Setup Family Shield"}</span>
          </button>
        </div>
      </header>

      {/* 3. Hero Section (Vibrant Violet Gradient matching CodeDesign.ai) */}
      <section className="hero-gradient-bg text-white py-12 px-4 md:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Social Proof Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs text-purple-100 shadow-xs">
            <span>👨‍👩‍👧</span>
            <span className="font-semibold text-white">45,000+ families</span>
            <span className="text-purple-200">protected across 40+ smog cities</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Winter Smog & Urban Air Quality Assistant
          </h1>

          {/* Subtitle */}
          <p className="text-purple-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Personalized low-emission daily routines, indoor purification hacks, and real-time AQI defense designed specifically for your household.
          </p>

          {/* Interactive Hero Quick Chips */}
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {HER_PILLS.map((pill) => (
              <button
                key={pill}
                onClick={() => setTriggeredPrompt(pill)}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-all font-medium backdrop-blur-sm"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Main Studio Dashboard */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Real-time AQI Meter + Quick Science Hacks */}
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
      </main>

      {/* 5. Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span>🌬️ ClearAir.ai</span>
            <span className="text-slate-400 font-normal">| GenAI Urban Air Defense</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>WHO Guidelines</span>
            <span>NASA Phytoremediation</span>
            <span>EPA PM2.5 Standards</span>
          </div>

          <p className="text-slate-400 text-[11px]">
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

const HER_PILLS = HERO_PILLS;
