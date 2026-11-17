"use client";

import { useState } from "react";
import { UserProfile } from "@/types";

interface ProfileSetupProps {
  initial: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export default function ProfileSetup({ initial, onSave, onClose }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(
    initial || {
      familyName: "",
      city: "Delhi",
      members: {},
      lifestyle: {},
      concerns: [],
    }
  );

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleConcern = (concern: string) => {
    const current = profile.concerns || [];
    if (current.includes(concern)) {
      updateProfile({ concerns: current.filter((c) => c !== concern) });
    } else {
      updateProfile({ concerns: [...current, concern] });
    }
  };

  const CONCERNS = [
    "Children's health",
    "Elderly care",
    "Respiratory conditions",
    "Outdoor exercise",
    "Cooking fumes",
    "Morning commute",
    "Sleep quality",
    "School runs",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div
        className="w-full max-w-md rounded-2xl border border-slate-700 overflow-hidden"
        style={{ background: "var(--card)" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Family Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5">Step {step} of 3 — Personalize your advice</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl">×</button>
          </div>
          {/* Progress */}
          <div className="flex gap-1 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: s <= step ? "linear-gradient(90deg,#0ea5e9,#6366f1)" : "#1e293b" }}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">📍 Your Location & Family</h3>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Family name (optional)</label>
                <input
                  value={profile.familyName || ""}
                  onChange={(e) => updateProfile({ familyName: e.target.value })}
                  placeholder="e.g. The Sharma Family"
                  className="w-full bg-slate-900 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700 focus:border-sky-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Your city *</label>
                <input
                  value={profile.city}
                  onChange={(e) => updateProfile({ city: e.target.value })}
                  placeholder="e.g. Delhi, Mumbai, Beijing..."
                  className="w-full bg-slate-900 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700 focus:border-sky-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Family members with special needs</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "children", label: "👶 Young children" },
                    { key: "elderly", label: "👴 Elderly members" },
                    { key: "pregnant", label: "🤰 Pregnant" },
                    { key: "asthma", label: "🫁 Respiratory issues" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() =>
                        updateProfile({
                          members: {
                            ...profile.members,
                            [key]: !profile.members[key as keyof typeof profile.members],
                          },
                        })
                      }
                      className={`text-xs px-3 py-2.5 rounded-xl border text-left transition-all ${
                        profile.members[key as keyof typeof profile.members]
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">🏠 Your Lifestyle</h3>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">🍳 Primary cooking method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "gas", l: "Gas 🔥" },
                    { v: "electric", l: "Electric ⚡" },
                    { v: "induction", l: "Induction 🌀" },
                    { v: "wood", l: "Wood/Coal 🪵" },
                    { v: "other", l: "Other" },
                  ].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() =>
                        updateProfile({ lifestyle: { ...profile.lifestyle, cookingMethod: v as UserProfile["lifestyle"]["cookingMethod"] } })
                      }
                      className={`text-xs px-2 py-2 rounded-xl border transition-all ${
                        profile.lifestyle.cookingMethod === v
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">🚗 How do you commute?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "car", l: "Car 🚗" },
                    { v: "bike", l: "Bike 🏍️" },
                    { v: "public", l: "Public 🚌" },
                    { v: "walk", l: "Walk 🚶" },
                    { v: "wfh", l: "WFH 💻" },
                  ].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() =>
                        updateProfile({ lifestyle: { ...profile.lifestyle, commute: v as UserProfile["lifestyle"]["commute"] } })
                      }
                      className={`text-xs px-2 py-2 rounded-xl border transition-all ${
                        profile.lifestyle.commute === v
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">🌿 How often does your family go outdoors?</label>
                <div className="flex gap-2">
                  {[
                    { v: "daily", l: "Daily 🌅" },
                    { v: "often", l: "Often" },
                    { v: "rarely", l: "Rarely" },
                  ].map(({ v, l }) => (
                    <button
                      key={v}
                      onClick={() =>
                        updateProfile({ lifestyle: { ...profile.lifestyle, outdoorActivity: v as UserProfile["lifestyle"]["outdoorActivity"] } })
                      }
                      className={`flex-1 text-xs px-3 py-2 rounded-xl border transition-all ${
                        profile.lifestyle.outdoorActivity === v
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">🎯 What are your main concerns?</h3>
              <p className="text-xs text-slate-400">Select all that apply — your assistant will prioritize these topics.</p>
              <div className="grid grid-cols-2 gap-2">
                {CONCERNS.map((concern) => (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    className={`text-xs px-3 py-2.5 rounded-xl border text-left transition-all ${
                      profile.concerns?.includes(concern)
                        ? "border-sky-500 bg-sky-500/10 text-sky-400"
                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-900/10 px-4 py-3 text-xs text-emerald-400">
                ✨ Your profile is saved locally on your device. We never send personal data to any server.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:border-slate-600 transition-all"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!profile.city.trim()}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={() => onSave(profile)}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #22c55e, #0ea5e9)" }}
            >
              ✅ Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
