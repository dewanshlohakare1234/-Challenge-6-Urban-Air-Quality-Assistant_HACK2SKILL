'use client';
import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (profile: { name: string; city: string }) => void;
  initial: { name: string; city: string } | null;
}

const CITIES = ['Delhi', 'Mumbai', 'Kolkata', 'Bangalore', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Beijing', 'Shanghai', 'Los Angeles', 'New York', 'London'];

export default function ProfileSetup({ onClose, onSave, initial }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initial?.name || '');
  const [city, setCity] = useState(initial?.city || 'Delhi');
  const [customCity, setCustomCity] = useState('');

  const steps = ['Your Name', 'Your City', 'Confirm'];
  const finalCity = customCity.trim() || city;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24,
          boxShadow: '0 24px 64px rgba(124,58,237,0.2)',
          width: '100%', maxWidth: 440,
          overflow: 'hidden', animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          padding: '28px 28px 24px', color: '#fff',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛡️</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Family Shield Setup</div>
          <div style={{ fontSize: 13, color: '#ddd6fe' }}>Personalize your air quality defense</div>

          {/* Step dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                  background: i <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s',
                }} />
                {i < steps.length - 1 && (
                  <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.3)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 28 }}>
          {step === 0 && (
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                What should I call you?
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Priya, Family Shield, Dad…"
                autoFocus
                style={{
                  width: '100%', border: '1.5px solid #ddd6fe', borderRadius: 12,
                  padding: '12px 16px', fontSize: 15,
                  fontFamily: 'Inter, sans-serif', color: '#1a1a2e',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = '#ddd6fe')}
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
              />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                This helps me personalize responses just for you.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                Where are you located?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setCustomCity(''); }}
                    style={{
                      border: `1.5px solid ${city === c && !customCity ? '#7c3aed' : '#e5e7eb'}`,
                      background: city === c && !customCity ? '#ede9fe' : '#fff',
                      color: city === c && !customCity ? '#5b21b6' : '#374151',
                      borderRadius: 999, padding: '6px 14px',
                      fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >{c}</button>
                ))}
              </div>
              <input
                value={customCity}
                onChange={e => setCustomCity(e.target.value)}
                placeholder="Or type any city…"
                style={{
                  width: '100%', border: '1.5px solid #ddd6fe', borderRadius: 12,
                  padding: '10px 14px', fontSize: 14,
                  fontFamily: 'Inter, sans-serif', color: '#1a1a2e',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = '#ddd6fe')}
              />
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>
                All set, {name}!
              </div>
              <div style={{
                background: '#ede9fe', borderRadius: 14,
                padding: '14px 20px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, color: '#5b21b6' }}>
                  📍 Monitoring <strong>{finalCity}</strong><br />
                  🛡️ Shield active for <strong>{name}</strong>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280' }}>
                ClearAir will now tailor all recommendations for your household in {finalCity}.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 12,
                  padding: '12px', fontSize: 14, fontWeight: 600,
                  color: '#6b7280', background: '#fff', cursor: 'pointer',
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 2) setStep(s => s + 1);
                else onSave({ name: name.trim() || 'Family', city: finalCity });
              }}
              disabled={step === 0 && !name.trim()}
              style={{
                flex: 2, borderRadius: 12, padding: '12px',
                fontSize: 14, fontWeight: 700, border: 'none',
                background: step === 0 && !name.trim()
                  ? '#e5e7eb'
                  : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: step === 0 && !name.trim() ? '#9ca3af' : '#fff',
                cursor: step === 0 && !name.trim() ? 'not-allowed' : 'pointer',
                boxShadow: step === 0 && !name.trim() ? 'none' : '0 4px 12px rgba(124,58,237,0.3)',
              }}
            >
              {step === 2 ? '🛡️ Activate Family Shield' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
