"use client";

import { useState } from "react";
import { UserProfile } from "@/types";

interface ProfileSetupProps {
  initial: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

const CONCERNS_LIST = [
  "Children's lungs & playtime",
  "Elderly respiratory care",
  "Asthma & inhaler guidance",
  "Cooking fumes & stove safety",
  "Safe morning exercise times",
  "School commute in-cabin air",
  "Sleep & night filtration",
  "Budget-friendly DIY purifiers",
];

export default function ProfileSetup({ initial, onSave, onClose }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(
    initial || {
      familyName: "",
      city: "Delhi",
      members: { children: true, elderly: false, asthma: false, pregnant: false },
      lifestyle: { cookingMethod: "gas", commute: "car", outdoorActivity: "daily" },
      concerns: ["Children's lungs & playtime", "Cooking fumes & stove safety"],
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Personalized Protection Shield
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Family Air Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Step {step} of 3 — Tailoring routines to your home & routine
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center text-sm font-semibold"
            >
              ✕
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  background:
                    s <= step
                      ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                      : "#e2e8f0",
                }}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Family / Household Name
                </label>
                <input
                  value={profile.familyName || ""}
                  onChange={(e) => updateProfile({ familyName: e.target.value })}
                  placeholder="e.g., The Sharma Household"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Primary Location / City *
                </label>
                <input
                  value={profile.city}
                  onChange={(e) => updateProfile({ city: e.target.value })}
                  placeholder="e.g., Delhi, Mumbai, Lahore, Beijing"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Vulnerable Household Members
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: "children", label: "👶 Young Children", sub: "Higher respiratory rate" },
                    { key: "elderly", label: "👴 Elderly Members", sub: "Cardiovascular risk" },
                    { key: "asthma", label: "🫁 Asthma / Allergies", sub: "Bronchial sensitivity" },
                    { key: "pregnant", label: "🤰 Expecting Mother", sub: "Placental barrier risk" },
                  ].map(({ key, label, sub }) => {
                    const active = profile.members[key as keyof typeof profile.members];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          updateProfile({
                            members: {
                              ...profile.members,
                              [key]: !active,
                            },
                          })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          active
                            ? "bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs"
                            : "bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  🍳 Daily Kitchen Cooking Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "gas", l: "Gas Burner 🔥", sub: "High NO₂" },
                    { v: "electric", l: "Electric Coil ⚡", sub: "Low emissions" },
                    { v: "induction", l: "Induction 🌀", sub: "Cleanest" },
                    { v: "wood", l: "Biomass / Coal 🪵", sub: "Hazardous" },
                    { v: "other", l: "Mixed / Other", sub: "Standard" },
                  ].map(({ v, l, sub }) => {
                    const active = profile.lifestyle.cookingMethod === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          updateProfile({
                            lifestyle: {
                              ...profile.lifestyle,
                              cookingMethod: v as UserProfile["lifestyle"]["cookingMethod"],
                            },
                          })
                        }
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          active
                            ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs">{l}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  🚗 Daily Commute & Transit Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "car", l: "Private Car 🚗" },
                    { v: "bike", l: "Two-Wheeler 🏍️" },
                    { v: "public", l: "Metro / Bus 🚌" },
                    { v: "walk", l: "Walking 🚶" },
                    { v: "wfh", l: "Work From Home 💻" },
                  ].map(({ v, l }) => {
                    const active = profile.lifestyle.commute === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          updateProfile({
                            lifestyle: {
                              ...profile.lifestyle,
                              commute: v as UserProfile["lifestyle"]["commute"],
                            },
                          })
                        }
                        className={`py-2.5 px-2 rounded-2xl border text-center transition-all text-xs font-semibold ${
                          active
                            ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  🏃 Outdoor Exposure Frequency
                </label>
                <div className="flex gap-2">
                  {[
                    { v: "daily", l: "Daily (Parks/Walks)" },
                    { v: "often", l: "Occasional (3-4x/wk)" },
                    { v: "rarely", l: "Minimal (Indoors)" },
                  ].map(({ v, l }) => {
                    const active = profile.lifestyle.outdoorActivity === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          updateProfile({
                            lifestyle: {
                              ...profile.lifestyle,
                              outdoorActivity: v as UserProfile["lifestyle"]["outdoorActivity"],
                            },
                          })
                        }
                        className={`flex-1 py-2 px-1 text-xs font-medium rounded-2xl border transition-all ${
                          active
                            ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  🎯 Top Health & Smog Concerns
                </label>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Select key areas to prioritize in your AI action plans.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CONCERNS_LIST.map((concern) => {
                    const active = profile.concerns?.includes(concern);
                    return (
                      <button
                        key={concern}
                        type="button"
                        onClick={() => toggleConcern(concern)}
                        className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                          active
                            ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {active ? "✓ " : "+ "}
                        {concern}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
                <span className="text-base">🔒</span>
                <span>
                  <strong>100% On-Device Privacy:</strong> Your family profile is stored in your
                  browser&apos;s local storage and never shared with third parties.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!profile.city.trim()}
              className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-40"
            >
              Continue to Step {step + 1} →
            </button>
          ) : (
            <button
              onClick={() => onSave(profile)}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md"
            >
              Save Family Profile & Apply Shield ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
