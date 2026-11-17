import { NextRequest, NextResponse } from "next/server";

// Using WAQI (World Air Quality Index) API — free tier
// Falls back to simulated data if no API key
const WAQI_API = "https://api.waqi.info";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "here";

  const apiKey = process.env.WAQI_API_KEY;

  if (!apiKey) {
    // Return realistic mock data for demo purposes
    return NextResponse.json(getMockAQIData(city));
  }

  try {
    const res = await fetch(
      `${WAQI_API}/feed/${encodeURIComponent(city)}/?token=${apiKey}`,
      { next: { revalidate: 1800 } }
    );
    const json = await res.json();

    if (json.status !== "ok") {
      return NextResponse.json(getMockAQIData(city));
    }

    const data = json.data;
    return NextResponse.json({
      city: data.city?.name || city,
      aqi: data.aqi,
      level: getAQILevel(data.aqi),
      dominentPollutant: data.dominentpol || "pm25",
      pollutants: {
        pm25: data.iaqi?.pm25?.v ?? null,
        pm10: data.iaqi?.pm10?.v ?? null,
        o3: data.iaqi?.o3?.v ?? null,
        no2: data.iaqi?.no2?.v ?? null,
        so2: data.iaqi?.so2?.v ?? null,
      },
      time: data.time?.s || new Date().toISOString(),
      mock: false,
    });
  } catch {
    return NextResponse.json(getMockAQIData(city));
  }
}

function getAQILevel(aqi: number): {
  label: string;
  color: string;
  emoji: string;
  advice: string;
} {
  if (aqi <= 50)
    return { label: "Good", color: "#22c55e", emoji: "🟢", advice: "Air quality is satisfactory." };
  if (aqi <= 100)
    return { label: "Moderate", color: "#eab308", emoji: "🟡", advice: "Unusually sensitive people should consider reducing prolonged outdoor exertion." };
  if (aqi <= 150)
    return { label: "Unhealthy for Sensitive Groups", color: "#f97316", emoji: "🟠", advice: "Children, elderly, and those with respiratory issues should limit outdoor activity." };
  if (aqi <= 200)
    return { label: "Unhealthy", color: "#ef4444", emoji: "🔴", advice: "Everyone may experience health effects. Sensitive groups may experience more serious effects." };
  if (aqi <= 300)
    return { label: "Very Unhealthy", color: "#a855f7", emoji: "🟣", advice: "Health alert: everyone may experience more serious health effects." };
  return { label: "Hazardous", color: "#7f1d1d", emoji: "⚫", advice: "Emergency conditions. Everyone is more likely to be affected." };
}

function getMockAQIData(city: string) {
  const mockCities: Record<string, number> = {
    delhi: 285,
    mumbai: 142,
    beijing: 198,
    london: 48,
    "new york": 62,
    lahore: 312,
    karachi: 175,
    dhaka: 230,
  };

  const normalizedCity = city.toLowerCase();
  const aqi = mockCities[normalizedCity] || Math.floor(Math.random() * 200) + 80;

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    aqi,
    level: getAQILevel(aqi),
    dominentPollutant: "pm25",
    pollutants: {
      pm25: Math.round(aqi * 0.7),
      pm10: Math.round(aqi * 0.9),
      o3: Math.round(aqi * 0.3),
      no2: Math.round(aqi * 0.4),
      so2: Math.round(aqi * 0.15),
    },
    time: new Date().toISOString(),
    mock: !process.env.WAQI_API_KEY,
  };
}
