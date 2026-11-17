"use client";

const TIPS = [
  {
    emoji: "🪴",
    title: "Air-Purifying Plants",
    tip: "Spider plants & peace lilies can remove up to 87% of air toxins in 24hrs",
    category: "Indoor",
    color: "#22c55e",
  },
  {
    emoji: "🌙",
    title: "Night Routine",
    tip: "Run your air purifier on high for 1hr before bedtime, then switch to silent mode",
    category: "Sleep",
    color: "#6366f1",
  },
  {
    emoji: "🍳",
    title: "Cooking Tip",
    tip: "Always use your exhaust fan while cooking — gas stoves emit NO₂ comparable to outdoor traffic",
    category: "Kitchen",
    color: "#f97316",
  },
  {
    emoji: "🪟",
    title: "Ventilation",
    tip: "Air out your home between 11am–2pm when pollution levels are typically lower",
    category: "Home",
    color: "#0ea5e9",
  },
  {
    emoji: "😷",
    title: "Mask Guidance",
    tip: "N95/KN95 masks block 95% of PM2.5 particles — surgical masks only block ~50%",
    category: "Protection",
    color: "#ec4899",
  },
  {
    emoji: "🚿",
    title: "After Outdoors",
    tip: "Shower and change clothes after prolonged outdoor exposure on high-AQI days",
    category: "Hygiene",
    color: "#8b5cf6",
  },
];

export default function QuickTips() {
  return (
    <div
      className="rounded-2xl border border-slate-800 overflow-hidden"
      style={{ background: "var(--card)" }}
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <span>⚡</span> Quick Tips
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Science-backed daily hacks</p>
      </div>

      <div className="px-3 pb-4 space-y-2">
        {TIPS.map((tip) => (
          <div
            key={tip.title}
            className="flex gap-3 items-start rounded-xl px-3 py-2.5 border border-slate-800/80 hover:border-slate-700 transition-all cursor-default"
            style={{ background: "rgba(15,23,42,0.5)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
              style={{ background: `${tip.color}20` }}
            >
              {tip.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-white">{tip.title}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-md"
                  style={{ background: `${tip.color}20`, color: tip.color }}
                >
                  {tip.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{tip.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
