export interface UserProfile {
  familyName?: string;
  city: string;
  members: {
    children?: boolean;
    elderly?: boolean;
    pregnant?: boolean;
    asthma?: boolean;
  };
  lifestyle: {
    cookingMethod?: "gas" | "electric" | "induction" | "wood" | "other";
    commute?: "car" | "bike" | "public" | "walk" | "wfh";
    outdoorActivity?: "daily" | "often" | "rarely";
  };
  concerns?: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AQIData {
  city: string;
  aqi: number;
  level: {
    label: string;
    color: string;
    emoji: string;
    advice: string;
  };
  dominentPollutant: string;
  pollutants: {
    pm25: number | null;
    pm10: number | null;
    o3: number | null;
    no2: number | null;
    so2: number | null;
  };
  time: string;
  mock: boolean;
}
