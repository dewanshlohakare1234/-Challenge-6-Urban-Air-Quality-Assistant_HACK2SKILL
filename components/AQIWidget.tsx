'use client';
import { useState, useEffect, useCallback } from 'react';

interface AQIData {
  aqi: number;
  city: string;
  pollutants: { pm25: number; pm10: number; no2: number; o3: number; so2: number };
  updatedAt: string;
}

function getAQIInfo(aqi: number) {
  if (aqi <= 50) return { label: 'Good', color: '#10b981', bg: '#d1fae5', bar: '#10b981', advice: 'Air quality is satisfactory.' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', bg: '#fef3c7', bar: '#f59e0b', advice: 'Unusually sensitive people should limit prolonged outdoor exertion.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316', bg: '#ffedd5', bar: '#f97316', advice: 'Sensitive groups should reduce outdoor activity.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: '#fee2e2', bar: '#ef4444', advice: 'Everyone should reduce outdoor activity.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#dc2626', bg: '#fce7f3', bar: '#dc2626', advice: 'Health warnings — everyone may experience serious effects.' };
  return { label: 'Hazardous', color: '#7f1d1d', bg: '#fef2f2', bar: '#7f1d1d', advice: 'Health alert! Avoid all outdoor activity.' };
}

interface Props {
  city: string;
  onCityChange: (city: string) => void;
}

export default function AQIWidget({ city, onCityChange }: Props) {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputCity, setInputCity] = useState(city);

  const fetchAQI = useCallback(async (c: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(c)}`);
      const json = await res.json();
      if (json.aqi) setData(json);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchAQI(city); }, [city, fetchAQI]);

  const handleSearch = () => {
    if (inputCity.trim()) {
      onCityChange(inputCity.trim());
    }
  };

  const info = data ? getAQIInfo(data.aqi) : null;
  const aqiPercent = data ? Math.min(100, (data.aqi / 500) * 100) : 0;

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
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          🌍 Live Atmosphere Monitor
        </div>
        {/* City search */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={inputCity}
            onChange={e => setInputCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Enter city…"
            style={{
              flex: 1, border: '1.5px solid #ddd6fe', borderRadius: 10,
              padding: '7px 12px', fontSize: 13,
              fontFamily: 'Inter, sans-serif', color: '#1a1a2e',
              background: '#fff', outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = '#ddd6fe')}
          />
          <button
            onClick={handleSearch}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none', borderRadius: 10, padding: '7px 14px',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {loading ? '…' : 'Search'}
          </button>
        </div>
      </div>

      {/* AQI Display */}
      <div style={{ padding: '20px 20px 0' }}>
        {loading && !data && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#7c3aed', fontSize: 14 }}>
            Fetching air quality data…
          </div>
        )}

        {data && info && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 2 }}>{data.city}</div>
                <div style={{ fontSize: 56, fontWeight: 900, color: info.color, lineHeight: 1 }}>{data.aqi}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>US AQI</div>
              </div>
              <div style={{
                background: info.bg, color: info.color,
                borderRadius: 10, padding: '6px 12px',
                fontSize: 12, fontWeight: 700, textAlign: 'right',
                maxWidth: 120,
              }}>
                {info.label}
              </div>
            </div>

            {/* AQI bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{
                height: 8, borderRadius: 4,
                background: 'linear-gradient(to right, #10b981, #f59e0b, #f97316, #ef4444, #dc2626, #7f1d1d)',
                position: 'relative', marginBottom: 4,
              }}>
                <div style={{
                  position: 'absolute', top: -3,
                  left: `calc(${aqiPercent}% - 7px)`,
                  width: 14, height: 14, borderRadius: '50%',
                  background: '#fff',
                  border: `3px solid ${info.color}`,
                  boxShadow: `0 0 0 3px ${info.bg}`,
                  transition: 'left 0.5s',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af' }}>
                <span>0</span><span>100</span><span>200</span><span>300</span><span>500</span>
              </div>
            </div>

            {/* Health advice */}
            <div style={{
              background: info.bg, borderRadius: 10, padding: '10px 12px',
              fontSize: 12, color: info.color, fontWeight: 500, marginBottom: 16,
            }}>
              ⚠️ {info.advice}
            </div>

            {/* Pollutants grid */}
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
              Key Pollutants
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'PM2.5', value: data.pollutants.pm25, unit: 'μg/m³', limit: 15 },
                { label: 'PM10', value: data.pollutants.pm10, unit: 'μg/m³', limit: 45 },
                { label: 'NO₂', value: data.pollutants.no2, unit: 'μg/m³', limit: 25 },
                { label: 'Ozone', value: data.pollutants.o3, unit: 'μg/m³', limit: 100 },
              ].map(p => (
                <div key={p.label} style={{
                  background: '#f8f7ff', borderRadius: 10,
                  padding: '10px 12px', border: '1px solid #ede9fe',
                }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: p.value > p.limit ? '#ef4444' : '#1a1a2e' }}>
                    {p.value}
                    <span style={{ fontSize: 11, fontWeight: 400, color: '#9ca3af', marginLeft: 2 }}>{p.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>Limit: {p.limit} {p.unit}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, color: '#9ca3af', paddingBottom: 16, textAlign: 'right' }}>
              Updated {data.updatedAt}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
