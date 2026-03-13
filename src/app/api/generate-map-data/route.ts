import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

function extractJsonArray(text: string): unknown[] {
  const attempts = [
    () => JSON.parse(text.trim()),
    () => JSON.parse(text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()),
    () => {
      const s = text.indexOf("["), e = text.lastIndexOf("]");
      if (s !== -1 && e > s) return JSON.parse(text.slice(s, e + 1));
      throw new Error("no array");
    },
  ];
  for (const attempt of attempts) {
    try {
      const r = attempt();
      if (Array.isArray(r)) return r;
    } catch {/* try next */}
  }
  throw new Error("Nessun JSON trovato");
}

const SYSTEM_PROMPT = `Sei un esperto geografo. Dato un testo di itinerario di viaggio, estrai i luoghi visitati ogni giorno con coordinate GPS reali e precise.

OUTPUT: SOLO JSON array valido. Nessun testo prima o dopo. Nessun markdown.

FORMATO ESATTO:
[
  {
    "day": 1,
    "places": [
      {"name":"Nome Posto Reale","lat":00.0000,"lng":00.0000,"order":1,"type":"colazione","description":"Breve"},
      {"name":"Nome Posto 2","lat":00.0000,"lng":00.0000,"order":2,"type":"attività","description":"Breve"},
      {"name":"Nome Posto 3","lat":00.0000,"lng":00.0000,"order":3,"type":"pranzo","description":"Breve"},
      {"name":"Nome Posto 4","lat":00.0000,"lng":00.0000,"order":4,"type":"pomeriggio","description":"Breve"},
      {"name":"Nome Posto 5","lat":00.0000,"lng":00.0000,"order":5,"type":"cena","description":"Breve"},
      {"name":"Nome Posto 6","lat":00.0000,"lng":00.0000,"order":6,"type":"sera","description":"Breve"}
    ]
  }
]

Valori type: "colazione" | "attività" | "pranzo" | "pomeriggio" | "cena" | "sera"
Includi 5-6 posti per giorno nell'ordine di visita.
USA COORDINATE GPS REALI dei luoghi specifici menzionati nell'itinerario.`;

export async function POST(req: NextRequest) {
  const { itinerary, destination, zone } = await req.json();

  if (!itinerary || !destination) {
    return Response.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key non configurata" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `Destinazione: ${destination}${zone ? `, zona: ${zone}` : ""}

ITINERARIO:
${itinerary}

Estrai tutti i luoghi visitati ogni giorno con coordinate GPS reali. Solo JSON.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const mapData = extractJsonArray(text);

    return Response.json(mapData);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[generate-map-data]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
