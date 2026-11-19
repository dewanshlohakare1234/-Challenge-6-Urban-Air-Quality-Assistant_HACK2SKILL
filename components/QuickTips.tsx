'use client';

const TIPS = [
  {
    emoji: '🌿',
    title: 'Air Purifying Plants',
    category: 'Indoor',
    categoryColor: '#10b981',
    categoryBg: '#d1fae5',
    desc: 'Spider plants & peace lilies can remove up to 87% of air toxins in 24hrs',
  },
  {
    emoji: '🌙',
    title: 'Night Routine',
    category: 'Sleep',
    categoryColor: '#6366f1',
    categoryBg: '#e0e7ff',
    desc: 'Run your air purifier on high for 1hr before bedtime, then switch to silent mode',
  },
  {
    emoji: '🍳',
    title: 'Cooking Tip',
    category: 'Kitchen',
    categoryColor: '#f59e0b',
    categoryBg: '#fef3c7',
    desc: 'Always use your exhaust fan while cooking — gas stoves emit NO₂ comparable to outdoor traffic',
  },
  {
    emoji: '💨',
    title: 'Ventilation Window',
    category: 'Home',
    categoryColor: '#0ea5e9',
    categoryBg: '#e0f2fe',
    desc: 'Air out your home between 11am–2pm when pollution levels are typically lower',
  },
  {
    emoji: '😷',
    title: 'Mask Guidance',
    category: 'Protection',
    categoryColor: '#ef4444',
    categoryBg: '#fee2e2',
    desc: 'N95/KN95 masks block 95% of PM2.5 particles — surgical masks only block ~50%',
  },
  {
    emoji: '🚿',
    title: 'After Outdoors',
    category: 'Hygiene',
    categoryColor: '#8b5cf6',
    categoryBg: '#ede9fe',
    desc: 'Shower and change clothes after prolonged outdoor exposure on high-AQI days',
  },
];

export default function QuickTips() {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
      border: '1px solid #ede9fe', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #faf5ff, #f0f9ff)',
        padding: '16px 20px',
        borderBottom: '1px solid #f3f0ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: 1, textTransform: 'uppercase' }}>⚡ Quick Tips</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Science-backed daily hacks</div>
        </div>
        <span style={{
          background: '#ede9fe', color: '#5b21b6',
          borderRadius: 999, padding: '4px 10px',
          fontSize: 11, fontWeight: 700,
        }}>{TIPS.length} tips</span>
      </div>

      {/* Tips list */}
      <div style={{ padding: '12px 20px 20px' }}>
        {TIPS.map((tip, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '12px 0',
            borderBottom: i < TIPS.length - 1 ? '1px solid #f3f0ff' : 'none',
          }}>
            {/* Icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: tip.categoryBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {tip.emoji}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{tip.title}</span>
                <span style={{
                  background: tip.categoryBg, color: tip.categoryColor,
                  borderRadius: 999, padding: '2px 8px',
                  fontSize: 10, fontWeight: 700,
                }}>{tip.category}</span>
              </div>
              <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.5, margin: 0 }}>{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
