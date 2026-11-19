'use client';
import { useState } from 'react';
import AQIWidget from '@/components/AQIWidget';
import ChatInterface from '@/components/ChatInterface';
import QuickTips from '@/components/QuickTips';
import ProfileSetup from '@/components/ProfileSetup';

const HERO_CHIPS = [
  '🌅 Safe morning hours for school & walks',
  '🔧 DIY MERV-13 air purifier box-fan guide',
  '🍳 Gas stove vs Induction: NO₂ health impact',
  '😷 Masking guidelines for toddlers & children',
  '🚗 Car AC recirculation in heavy smog',
];

export default function Home() {
  const [activePrompt, setActivePrompt] = useState('');
  const [city, setCity] = useState('Delhi');
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<{ name: string; city: string } | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff', fontFamily: 'Inter, sans-serif' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ede9fe',
        padding: '0 24px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🌬️</div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', letterSpacing: '-0.5px' }}>ClearAir</span>
            <span style={{ fontWeight: 400, fontSize: 11, color: '#7c3aed', display: 'block', marginTop: -2 }}>Urban Air Defense</span>
          </div>
        </div>

        {/* City pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#ede9fe', borderRadius: 999,
          padding: '6px 14px',
          fontSize: 13, fontWeight: 600, color: '#5b21b6',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          Monitoring: {profile?.city || city}
        </div>

        {/* Profile button */}
        <button
          onClick={() => setShowProfile(true)}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>🛡️</span> {profile ? `Shield: ${profile.name}` : 'Setup Family Shield'}
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(160deg, #7c3aed 0%, #6d28d9 40%, #4f46e5 100%)',
        padding: '72px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Soft glow circles */}
        <div style={{
          position: 'absolute', top: -60, left: '10%',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: '8%',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 999, padding: '6px 16px',
          fontSize: 13, color: '#e9d5ff', fontWeight: 500,
          marginBottom: 24,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span>✨</span> Powered by Gemini 3.8 Flash · Real-time AQI data
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900, color: '#fff',
          lineHeight: 1.15, letterSpacing: '-1.5px',
          marginBottom: 20, maxWidth: 720, margin: '0 auto 20px',
        }}>
          Breathe Smarter.<br />
          <span style={{ color: '#c4b5fd' }}>Protect Your Family.</span>
        </h1>

        <p style={{
          fontSize: 18, color: '#ddd6fe',
          maxWidth: 540, margin: '0 auto 40px',
          fontWeight: 400, lineHeight: 1.7,
        }}>
          Personalized low-emission routines, indoor purification hacks,<br />
          and real-time AQI defense — designed for your household.
        </p>

        {/* Quick-prompt chips */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          justifyContent: 'center', maxWidth: 800, margin: '0 auto',
        }}>
          {HERO_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActivePrompt(chip)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 999, padding: '8px 16px',
                fontSize: 13, color: '#ede9fe', fontWeight: 500,
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)';
                (e.target as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                (e.target as HTMLButtonElement).style.color = '#ede9fe';
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '40px 24px 80px',
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: 24,
        alignItems: 'start',
      }}>
        {/* LEFT: AQI + Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AQIWidget city={profile?.city || city} onCityChange={setCity} />
          <QuickTips />
        </div>

        {/* RIGHT: Chat */}
        <ChatInterface
          activePrompt={activePrompt}
          onPromptConsumed={() => setActivePrompt('')}
          city={profile?.city || city}
          profile={profile}
        />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid #ede9fe',
        background: '#fff',
        padding: '24px',
        textAlign: 'center',
        fontSize: 13, color: '#6b7280',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 8, flexWrap: 'wrap' }}>
          <a href="https://www.who.int/health-topics/air-pollution" target="_blank" rel="noopener" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>WHO Guidelines</a>
          <a href="https://cfpub.epa.gov/air/airnow/index.cfm?action=airnow.global_summary" target="_blank" rel="noopener" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>EPA AQI Scale</a>
          <a href="https://phytoremediation.org" target="_blank" rel="noopener" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>NASA Phytoremediation</a>
        </div>
        <p>ClearAir.ai · GenAI Urban Air Defense · Powered by Google Gemini 3.8 Flash</p>
      </footer>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileSetup
          onClose={() => setShowProfile(false)}
          onSave={(p) => { setProfile(p); setCity(p.city); setShowProfile(false); }}
          initial={profile}
        />
      )}
    </div>
  );
}
