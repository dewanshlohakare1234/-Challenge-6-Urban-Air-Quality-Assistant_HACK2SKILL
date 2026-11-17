import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const SYSTEM_INSTRUCTION = `You are ClearAir — a compassionate, science-backed GenAI assistant that helps families and communities navigate severe winter smog and urban air pollution. 

Your role is to:
1. Provide real-time, location-aware guidance on air quality and pollution levels
2. Suggest low-emission daily routines tailored to the user's lifestyle (morning commute, school runs, cooking habits, etc.)
3. Recommend indoor air quality improvements using practical, affordable hacks
4. Offer sustainable alternatives to common high-emission activities
5. Clearly explain the DIRECT health and environmental impact of each choice using data
6. Use empathetic, friendly language — never alarmist, always empowering

When a user tells you their location or describes their situation:
- Acknowledge the specific pollution challenges in their region (e.g., Delhi's winter smog, Beijing AQI spikes, etc.)
- Tailor advice to their climate, culture, and typical lifestyle
- Give concrete, actionable steps — not generic advice
- Quantify impact when possible (e.g., "switching to this reduces PM2.5 exposure by ~40%")
- Categorize suggestions into: 🌅 Morning Routine | 🏠 Indoor Air | 🚗 Commute | 🍳 Cooking | 😴 Night & Sleep

Always structure longer responses with clear headers and bullet points.
Use emojis sparingly but meaningfully to aid scannability.
If asked about AQI numbers, explain what they mean for different family members (children, elderly, pregnant women).
End every response with one "Quick Win" — a single thing they can do RIGHT NOW.`;

function generateSimulatedResponse(message: string, city: string, profile: any): string {
  const familyName = profile?.familyName || "your family";
  const hasKids = profile?.members?.children;
  const hasElderly = profile?.members?.elderly;
  const hasAsthma = profile?.members?.asthma;
  const cooking = profile?.lifestyle?.cookingMethod || "gas";
  const commute = profile?.lifestyle?.commute || "car";

  return `### 🌬️ ClearAir Guidance for ${cityName(city)}

Thank you for reaching out regarding air quality protection for **${familyName}**. Here is your tailored, science-backed action plan:

---

### 🌅 Morning Routine
- **Avoid early morning outdoor exercise (6 AM – 9 AM):** Winter temperature inversions trap heavy particulate matter at ground level. Shift jogging or walks to **11:30 AM – 2:30 PM** when solar heating disperses smog.
- **Ventilation Window:** Open south-facing windows for only 15–20 minutes around noon if outdoor AQI is below 180.
- ${hasKids ? "**Kids School Drop:** Keep school bus or car windows rolled up with AC set to **internal recirculation** mode to reduce in-cabin PM2.5 by **65%**." : "**Ventilation:** Keep doors sealed in early morning hours."}

---

### 🏠 Indoor Air Hacks & Low-Cost Upgrades
- **DIY Air Purifier:** If purifiers are unavailable, tape a **HEPA or MERV-13 filter** to a standard box fan. This DIY setup removes up to **75–80% of ambient PM2.5** at a fraction of the cost.
- **Moist Mopping:** Avoid dry sweeping, which resuspends settled toxic particulates into your breathing zone. Wet mop floors twice daily with warm water.
- **Natural Phytoremediation:** Position **Snake Plants** and **Areca Palms** in living areas and bedrooms. NASA clean air studies show they absorb formaldehyde and benzene.

---

### 🍳 Cooking & Kitchen Precautions (${cooking.toUpperCase()} Stove)
${
  cooking === "gas"
    ? "- **Gas Stove Warning:** Cooking on gas without ventilation produces Nitrogen Dioxide (NO₂) levels that can exceed outdoor EPA limits within 15 minutes.\n- **Action:** Always turn on your exhaust hood 1 minute *before* igniting the burner, and leave it on 3 minutes after.\n- **Direct Impact:** Running exhaust drops kitchen NO₂ and ultrafine particulates by **50–70%**."
    : "- **Clean Energy Benefit:** Using an electric/induction setup already cuts your indoor nitrogen dioxide emissions to near zero! Keep using lid-covered pots to reduce aerosolized cooking oils."
}

---

### 🚗 Sustainable Commute & Alternatives (${commute.toUpperCase()})
- **Carpool or Metro Transition:** Switching two single-passenger car trips per week to electric metro or shared transit eliminates **approx. 4.2 kg of CO₂ and 18g of NOx** per family weekly.
- **Masking:** When in transit or waiting at bus stations, wear a snug **N95 / FFP2 mask**. Surgical masks leave side gaps that allow up to 60% of PM2.5 leakage.

---

${
  hasAsthma || hasKids || hasElderly
    ? `### 🩺 High-Risk Family Health Alert
- ${hasAsthma ? "Keep prescribed rescue inhalers accessible; winter dry smog triggers bronchial constriction." : ""}
- ${hasElderly ? "Elderly individuals should monitor oxygen saturation and avoid heavy exertion when AQI > 150." : ""}
- ${hasKids ? "Children inhale 50% more air per pound of body weight than adults—strictly limit outdoor playtime during high pollution alerts." : ""}

---`
    : ""
}

### 💡 Quick Win (Do this right now)
> **Wipe down window sills and door frames with a damp cloth** to prevent accumulated particulate dust from circulating whenever people move through rooms.`;
}

function cityName(c: string) {
  if (!c) return "your area";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export async function POST(req: NextRequest) {
  const { message, previousInteractionId, userProfile } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  const encoder = new TextEncoder();

  // If no Gemini API key is provided, stream the high quality simulated response
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    const simulated = generateSimulatedResponse(
      message,
      userProfile?.city || "Delhi",
      userProfile
    );

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "id", id: "sim-" + Date.now() })}\n\n`)
        );

        // Stream simulated text in chunks
        const chunkSize = 28;
        for (let i = 0; i < simulated.length; i += chunkSize) {
          const chunk = simulated.slice(i, i + chunkSize);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`)
          );
          await new Promise((r) => setTimeout(r, 18));
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // Real Gemini API via official SDK
  const client = new GoogleGenAI({ apiKey });
  const profileContext = userProfile
    ? `\n\nUser Profile: ${JSON.stringify(userProfile)}`
    : "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const streamOptions: any = {
          model: "gemini-3.8-flash",
          input: message + profileContext,
          system_instruction: SYSTEM_INSTRUCTION,
          stream: true,
          store: true,
        };

        if (previousInteractionId && !previousInteractionId.startsWith("sim-")) {
          streamOptions.previous_interaction_id = previousInteractionId;
        }

        const streamResponse = (await client.interactions.create(streamOptions)) as unknown as AsyncIterable<any>;

        let interactionId: string | null = null;

        for await (const event of streamResponse) {
          if (event.event_type === "interaction.created" && event.interaction?.id) {
            interactionId = event.interaction.id;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "id", id: interactionId })}\n\n`)
            );
          } else if (event.event_type === "step.delta") {
            if (event.delta?.type === "text" && event.delta.text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`)
              );
            }
          } else if (event.event_type === "interaction.completed") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
            );
          }
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
