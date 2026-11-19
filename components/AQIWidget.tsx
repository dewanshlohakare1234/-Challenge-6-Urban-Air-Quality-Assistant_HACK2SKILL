"use client";

import { useState, useEffect, useCallback } from "react";
import { AQIData } from "@/types";

interface AQIWidgetProps {
  city: string;
  onCityChange: (city: string) => void;
}

const POLLUTANT_METRICS: Record<
  string,
  { label: string; safeLimit: string; description: string }
> = {
  pm25: { label: "PM2.5", safeLimit: "15 µg/m³", description: "Fine inhalable particles" },
  pm10: { label: "PM10", safeLimit: "45 µg/m³", description: "Coarse dust & pollen" },
  no2: { label: "NO₂", safeLimit: "25 µg/m³", description: "Vehicle & gas fumes" },
  o3: { label: "Ozone", safeLimit: "100 µg/m³", description: "Ground-level smog" },
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
      // silent fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAQI(city);
    setInputCity(city);
    const interval = setInterval(() => fetchAQI(city), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, fetchAQI]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      onCityChange(inputCity.trim());
    }
  };

  const aqiScore = data?.aqi || 0;
  const aqiPercent = Math.min((aqiScore / 500) * 100, 100);

  return (
    <div className="card-subtle rounded-3xl p-6 bg-white transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Live Atmosphere Monitor
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">{data?.city || city}</h3>
        </div>

        <button
          onClick={() => fetchAQI(city)}
          className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-indigo-50 text-xs font-medium flex items-center gap-1.5"
          title="Refresh readings"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sync
        </button>
      </div>

      {/* City Switcher Input */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative flex items-center">
          <input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Change city (e.g., Delhi, Mumbai, London)..."
            className="w-full pl-3.5 pr-20 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm"
          >
            Check
          </button>
        </div>
      </form>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Fetching real-time sensor stations...</p>
        </div>
      ) : data ? (
        <div>
          {/* Main AQI Display */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight" style={{ color: data.level.color }}>
                {data.aqi}
              </span>
              <span className="text-xs text-slate-500 font-medium">US AQI</span>
            </div>

            <div
              className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
              style={{
                backgroundColor: `${data.level.color}18`,
                color: data.level.color,
                border: `1px solid ${data.level.color}35`,
              }}
            >
              <span>{data.level.emoji}</span>
              <span>{data.level.label}</span>
            </div>
          </div>

          {/* AQI Range Meter */}
          <div className="mt-3 mb-2">
            <div className="h-2.5 rounded-full aqi-bar-gradient relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-md transition-all duration-500"
                style={{ left: `calc(${aqiPercent}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
              <span>0 (Good)</span>
              <span>100</span>
              <span>200</span>
              <span>300 (Hazardous)</span>
            </div>
          </div>

          {/* Health Advisory Callout */}
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-indigo-900 block mb-0.5">Health Guidance:</span>
            {data.level.advice}
          </div>

          {/* Pollutant Breakdown Grid */}
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Key Pollutant Concentrations
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(POLLUTANT_METRICS).map(([key, meta]) => {
                const val = data.pollutants[key as keyof typeof data.pollutants];
                return (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{meta.label}</span>
                      <span className="text-[10px] text-slate-400">Limit: {meta.safeLimit}</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-slate-900">
                        {val !== null ? val : "—"}
                      </span>
                      <span className="text-[10px] text-slate-500">µg/m³</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{meta.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {lastUpdated && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              {data.mock && <span className="text-amber-600 font-medium">Demo Sensor Feed</span>}
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-400">No air data available for this city.</div>
      )}
    </div>
  );
}
