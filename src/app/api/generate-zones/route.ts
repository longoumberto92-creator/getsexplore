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

const SYSTEM_PROMPT = `Sei un esperto di geografia urbana e travel planning. Dato una destinazione e le preferenze del viaggiatore, genera esattamente 4 quartieri o zone ideali da esplorare.

OUTPUT: Solo JSON valido. Nessun testo aggiuntivo, nessun markdown, nessuna spiegazione prima o dopo il JSON.

FORMATO ESATTO (array di 4 oggetti):
[{"id":"z1","name":"Nome Quartiere Reale","description":"2-3 frasi su cosa offre questo quartiere e perché è perfetto per questo viaggiatore.","atmosphere":"Keyword1 · Keyword2 · Keyword3","center":{"lat":XX.XXXX,"lng":XX.XXXX},"radius":600},{"id":"z2","name":"...","description":"...","atmosphere":"...","center":{"lat":XX.XXXX,"lng":XX.XXXX},"radius":700},{"id":"z3","name":"...","description":"...","atmosphere":"...","center":{"lat":XX.XXXX,"lng":XX.XXXX},"radius":500},{"id":"z4","name":"...","description":"...","atmosphere":"...","center":{"lat":XX.XXXX,"lng":XX.XXXX},"radius":600}]

REGOLE:
- Usa nomi di quartieri REALI e conosciuti della città
- Coordinate GPS accurate e realistiche per la città indicata
- radius tra 400 e 900 metri, adattato all'estensione del quartiere
- Le zone devono essere diverse tra loro e coprire aree geografiche diverse della città
- Adatta le scelte agli stili e al budget del viaggiatore`;

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

  const stylesList = stylesArray.map((s) => STYLE_LABELS[s] ?? s).join(", ");
  const spendingLabel = spending <= 2 ? "budget/economico" : spending === 3 ? "mid-range" : "luxury";

  const userMessage = `Destinazione: ${destination}
Stili di viaggio: ${stylesList}
Budget: ${spendingLabel}

Genera 4 zone/quartieri ideali. Solo JSON.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Strip any markdown code fences if Claude adds them
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const zones = JSON.parse(cleaned);

    if (!Array.isArray(zones) || zones.length === 0) {
      throw new Error("Formato zone non valido");
    }

    return Response.json(zones);
  } catch {
    return Response.json({ error: "Errore nella generazione delle zone" }, { status: 500 });
  }
}
