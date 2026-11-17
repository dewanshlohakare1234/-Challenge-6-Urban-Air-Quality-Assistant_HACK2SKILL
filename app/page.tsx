"use client";

import { useState, useEffect, useRef } from "react";
import AQIWidget from "@/components/AQIWidget";
import ChatInterface from "@/components/ChatInterface";
import ProfileSetup from "@/components/ProfileSetup";
import QuickTips from "@/components/QuickTips";
import { UserProfile } from "@/types";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [city, setCity] = useState("Delhi");
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
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(10,15,30,0.9)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-pulse"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
            <span className="text-lg">🌬️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">ClearAir</h1>
            <p className="text-xs text-slate-400">Your Family Air Quality Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile && (
            <span className="text-xs text-slate-400 hidden sm:block">
              👤 {profile.familyName || "My Family"}
            </span>
          )}
          <button
            onClick={() => setShowProfileSetup(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-400 transition-all"
          >
            {profile ? "✏️ Profile" : "⚙️ Setup"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AQI + Tips */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <AQIWidget city={city} onCityChange={setCity} />
          <QuickTips />
        </div>

        {/* Right Column: Chat */}
        <div className="lg:col-span-2">
          <ChatInterface userProfile={profile} city={city} />
        </div>
      </div>

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetup
          initial={profile}
          onSave={handleProfileSave}
          onClose={() => setShowProfileSetup(false)}
        />
      )}

      {/* First-time Profile Setup Prompt */}
      {!profile && !showProfileSetup && isLoaded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 fade-in-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-sky-800 text-sm"
            style={{ background: "rgba(14,165,233,0.15)", backdropFilter: "blur(12px)" }}>
            <span>✨</span>
            <span className="text-slate-200">Set up your family profile for personalized air quality advice</span>
            <button
              onClick={() => setShowProfileSetup(true)}
              className="ml-2 px-3 py-1 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
