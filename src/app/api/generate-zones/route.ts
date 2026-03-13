import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const STYLE_LABELS: Record<string, string> = {
  avventura: "Avventura",
  lusso:     "Lusso",
  cultura:   "Cultura",
  cibo:      "Cibo & Cucina",
  natura:    "Natura",
  relax:     "Relax",
  nightlife: "Nightlife",
  shopping:  "Shopping",
  arte:      "Arte",
  offbeat:   "Off the beaten path",
};

// Extracts the first JSON array found in a string
function extractJsonArray(text: string): unknown[] {
  // Try direct parse first
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) return parsed;
  } catch {/* fall through */}

  // Strip markdown fences
  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try {
    const parsed = JSON.parse(stripped);
    if (Array.isArray(parsed)) return parsed;
  } catch {/* fall through */}

  // Extract first [...] block
  const start = text.indexOf("[");
  const end   = text.lastIndexOf("]");
  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(parsed)) return parsed;
    } catch {/* fall through */}
  }

  throw new Error("Nessun array JSON trovato nella risposta");
}

const SYSTEM_PROMPT = `Sei un esperto di geografia urbana. Dato una destinazione e preferenze di viaggio, restituisci SOLO un array JSON con esattamente 4 quartieri ideali. Nessun testo prima o dopo. Nessun markdown.

Formato (rispetta esattamente questa struttura):
[
  {
    "id": "z1",
    "name": "Nome Quartiere",
    "description": "2-3 frasi sul quartiere e perché è ideale per questo viaggiatore.",
    "atmosphere": "Keyword1 · Keyword2 · Keyword3",
    "center": {"lat": 00.0000, "lng": 00.0000},
    "radius": 600
  },
  {"id":"z2","name":"...","description":"...","atmosphere":"...","center":{"lat":0,"lng":0},"radius":600},
  {"id":"z3","name":"...","description":"...","atmosphere":"...","center":{"lat":0,"lng":0},"radius":600},
  {"id":"z4","name":"...","description":"...","atmosphere":"...","center":{"lat":0,"lng":0},"radius":600}
]

Usa nomi di quartieri REALI con coordinate GPS accurate per la città.`;

export async function POST(req: NextRequest) {
  const { destination, styles, spending } = await req.json();

  if (!destination) {
    return Response.json({ error: "Destinazione mancante" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key non configurata" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const stylesArray: string[] = Array.isArray(styles) && styles.length > 0
    ? styles
    : ["cultura"];

  const stylesList   = stylesArray.map((s) => STYLE_LABELS[s] ?? s).join(", ");
  const spendingNum  = Number(spending) || 3;
  const spendingLabel = spendingNum <= 2 ? "budget" : spendingNum === 3 ? "mid-range" : "luxury";

  const userMessage = `Destinazione: ${destination}
Stili: ${stylesList}
Budget: ${spendingLabel}

Restituisci SOLO il JSON array con 4 zone.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const zones = extractJsonArray(text);

    if (zones.length === 0) {
      return Response.json({ error: "Nessuna zona generata" }, { status: 500 });
    }

    return Response.json(zones);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[generate-zones]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
