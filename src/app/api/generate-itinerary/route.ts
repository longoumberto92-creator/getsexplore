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

function buildSpendingContext(spending: number): string {
  if (spending <= 2) {
    return `BUDGET (${"€".repeat(spending)}): ostelli o guesthouse locali, street food e trattorie economiche, mezzi pubblici, attività gratuite o low-cost.`;
  }
  if (spending === 3) {
    return `MID-RANGE (€€€): hotel 3-4 stelle, ristoranti locali di qualità, mix di taxi e mezzi pubblici.`;
  }
  return `LUXURY (${"€".repeat(spending)}): ristoranti gastronomici o stellati, esperienze private, transfer privati. Nessun compromesso.`;
}

const SYSTEM_PROMPT = `Sei GetSXplore, un travel companion AI che crea itinerari narrativi e immersivi in italiano.
Il tuo stile è editoriale di lusso — come Condé Nast Traveller o National Geographic.

L'utente ha già scelto hotel e zona di riferimento. Crea l'itinerario giornaliero completo.

Apri con 2-3 frasi evocative sulla destinazione (nessun titolo).

Per ogni giorno usa ESATTAMENTE questa struttura:

## Giorno N — Titolo Poetico della Giornata

Paragrafo narrativo di 3-4 righe sul mood del giorno — emozione, atmosfera, ritmo.

- 🌅 MATTINA & COLAZIONE:
  - **Nome posto reale** — Quartiere — cosa ordinare o fare di specifico

- 🍽️ PRANZO:
  - **Nome ristorante reale** — Quartiere — piatto consigliato — fascia prezzo (€/€€/€€€/€€€€)

- 🌆 POMERIGGIO:
  - Attività specifica 1 con dettagli concreti
  - Attività specifica 2 con dettagli concreti

- 🌙 SERA & CENA:
  - **Nome ristorante reale** — Quartiere — piatto — atmosfera in una frase
  - Dopo cena: **Nome locale o luogo** — cosa fare

---

Chiudi con un paragrafo poetico finale (preceduto da ---).

REGOLE TASSATIVE:
- Nomi REALI sempre: ristoranti, bar, quartieri — mai generici o inventati
- Coerenza geografica: ogni giornata si svolge vicino alla zona prescelta
- Adatta tutto al budget specificato
- Nessuna sezione hotel nei giorni (già scelto)`;

export async function POST(req: NextRequest) {
  const { destination, styles, spending, days, zone, hotel } = await req.json();

  if (!destination || !days) {
    return Response.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key non configurata" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const stylesArray: string[] = Array.isArray(styles) && styles.length > 0
    ? styles
    : ["cultura"];

  const stylesList = stylesArray.map((s: string) => STYLE_LABELS[s] ?? s).join(", ");
  const spendingContext = buildSpendingContext(spending ?? 3);
  const spendingEmoji = "€".repeat(spending ?? 3);

  const zoneContext = zone
    ? `\nZona base: ${zone.name} — ${zone.description}`
    : "";

  const hotelContext = hotel
    ? `\nHotel scelto: ${hotel.name}, ${hotel.vicinity}`
    : "";

  const userMessage = `Crea un itinerario di ${days} giorni a ${destination}.

Stili: ${stylesList}
Budget: ${spendingEmoji} — ${spendingContext}${zoneContext}${hotelContext}

Struttura ogni giorno con le sezioni 🌅/🍽️/🌆/🌙. Nomi reali di luoghi, ristoranti, bar. Tutto in italiano.`;

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
