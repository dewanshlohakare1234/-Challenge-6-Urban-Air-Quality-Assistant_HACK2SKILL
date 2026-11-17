"use client";

import { useState, useEffect, useCallback } from "react";
import { AQIData } from "@/types";

interface AQIWidgetProps {
  city: string;
  onCityChange: (city: string) => void;
}

const POLLUTANT_LABELS: Record<string, string> = {
  pm25: "PM2.5",
  pm10: "PM10",
  o3: "Ozone",
  no2: "NO₂",
  so2: "SO₂",
};

export default function AQIWidget({ city, onCityChange }: AQIWidgetProps) {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputCity, setInputCity] = useState(city);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAQI = useCallback(async (c: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(c)}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAQI(city);
    const interval = setInterval(() => fetchAQI(city), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, fetchAQI]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      onCityChange(inputCity.trim());
    }
  };

  const aqiPercent = data ? Math.min((data.aqi / 500) * 100, 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-800 overflow-hidden"
      style={{ background: "var(--card)" }}>
      {/* City Search */}
      <div className="px-4 pt-4 pb-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Enter your city..."
            className="flex-1 bg-slate-900 text-sm text-white rounded-xl px-3 py-2 border border-slate-700 focus:border-sky-500 focus:outline-none placeholder:text-slate-500 transition-colors"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
          >
            🔍
          </button>
        </form>
      </div>

      {loading ? (
        <div className="px-4 pb-4 flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Fetching air quality data...</p>
          </div>
        </div>
      ) : data ? (
        <div className="px-4 pb-4">
          {/* City name */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-white">{data.city}</h2>
              {data.mock && (
                <span className="text-xs text-amber-500/80">⚠ Demo data — add WAQI_API_KEY for live readings</span>
              )}
            </div>
            <button
              onClick={() => fetchAQI(city)}
              className="text-slate-500 hover:text-sky-400 transition-colors text-xs"
              title="Refresh"
            >
              ↻ Refresh
            </button>
          </div>

          {/* Big AQI number */}
          <div className="flex items-end gap-4 mb-4">
            <div className="text-6xl font-black" style={{ color: data.level.color }}>
              {data.aqi}
            </div>
            <div className="pb-1">
              <div className="text-sm font-semibold" style={{ color: data.level.color }}>
                {data.level.emoji} {data.level.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">US AQI Scale</div>
            </div>
          </div>

          {/* AQI Gauge Bar */}
          <div className="mb-3">
            <div className="h-2 rounded-full aqi-gradient relative mb-1">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-900 shadow-lg transition-all duration-500"
                style={{ left: `calc(${aqiPercent}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>500</span>
            </div>
          </div>

          {/* Advice */}
          <div className="text-xs text-slate-400 mb-4 leading-relaxed px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800">
            {data.level.advice}
          </div>

          {/* Pollutants grid */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.pollutants)
              .filter(([, v]) => v !== null)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl px-3 py-2 bg-slate-900/60 border border-slate-800"
                >
                  <div className="text-xs text-slate-500 mb-0.5">{POLLUTANT_LABELS[key]}</div>
                  <div className="text-sm font-semibold text-white">
                    {value} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                  </div>
                </div>
              ))}
          </div>

          {lastUpdated && (
            <p className="text-xs text-slate-600 mt-3 text-right">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      ) : (
        <div className="px-4 pb-4 text-center text-slate-500 text-sm py-8">
          No data found for "{city}"
        </div>
      )}
    </div>
  );
}
