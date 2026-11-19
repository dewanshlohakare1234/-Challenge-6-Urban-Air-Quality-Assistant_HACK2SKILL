"use client";

const AIR_TIPS = [
  {
    icon: "🪴",
    title: "NASA Phytoremediation",
    badge: "Indoor Hack",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Spider plants and Peace Lilies absorb up to 87% of indoor volatile toxins within 24 hours.",
  },
  {
    icon: "🌀",
    title: "DIY Box-Fan Filter",
    badge: "Budget Saver",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    desc: "Taping a MERV-13 furnace filter to a standard box fan achieves ~80% of a commercial HEPA filter's capture rate.",
  },
  {
    icon: "🍳",
    title: "Kitchen Exhaust Rule",
    badge: "Cooking Safety",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "Turn on range hood 1 minute before lighting gas burners to prevent toxic NO₂ accumulation exceeding outdoor limits.",
  },
  {
    icon: "🪟",
    title: "Ventilation Window",
    badge: "Daily Routine",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    desc: "Avoid early morning ventilation during winter thermal inversions. Air rooms between 12:00 PM and 2:30 PM.",
  },
  {
    icon: "😷",
    title: "N95 Seal Importance",
    badge: "Commute",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Surgical masks allow 50%+ particle leakage around the cheeks. A sealed N95/FFP2 blocks 95%+ of PM2.5.",
  },
  {
    icon: "🧹",
    title: "Wet Mop Protocol",
    badge: "Household",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "Never dry sweep indoors during smog season; it resuspends heavy toxic settled dust into children's breathing zone.",
  },
];

export default function QuickTips() {
  return (
    <div className="card-subtle rounded-3xl p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Science-Backed Hacks
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">Household Air Defenses</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          6 Core Protocols
        </span>
      </div>

      <div className="space-y-3">
        {AIR_TIPS.map((tip) => (
          <div
            key={tip.title}
            className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl p-2 rounded-xl bg-white border border-slate-100 shadow-xs flex-shrink-0 group-hover:scale-110 transition-transform">
                {tip.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{tip.title}</h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tip.badgeColor}`}
                  >
                    {tip.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
