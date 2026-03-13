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
    return `BUDGET (€${spending === 1 ? "" : "€"}): ostelli o guesthouse locali, street food e trattorie economiche, mezzi pubblici, attività gratuite o low-cost. Niente luxury, ma autenticità al massimo.`;
  }
  if (spending === 3) {
    return `MID-RANGE (€€€): hotel 3-4 stelle ben posizionati, ristoranti locali di qualità (non stellati), qualche esperienza a pagamento, mix di taxi e mezzi pubblici.`;
  }
  return `LUXURY (€${"€".repeat(spending - 1)}): hotel 5 stelle o boutique hotel di design, ristoranti gastronomici o stellati, esperienze private ed esclusive, transfer privati. Nessun compromesso.`;
}

const SYSTEM_PROMPT = `Sei GetSXplore, un travel companion AI che crea itinerari di viaggio narrativi e immersivi in italiano.
Il tuo stile è editoriale di lusso — come un articolo di Condé Nast Traveller o National Geographic.

Non elenchi posti: racconti esperienze. Ogni giorno ha un filo narrativo, un'emozione, un ritmo.

STRUTTURA OBBLIGATORIA PER OGNI GIORNO:

## Giorno N — [Titolo Poetico del Giorno]

[2-3 frasi di apertura narrativa che introducono il mood del giorno]

### MATTINA

[Descrizione narrativa della mattina. Se colazione non inclusa nell'hotel: suggerisci 1 caffetteria o bar locale specifico con nome, zona e perché è speciale. Poi attività mattutina immersiva.]

### PRANZO

[1 ristorante specifico con nome reale, zona/quartiere, piatto consigliato. Coerente con spending level. Racconta perché vale la pena.]

### POMERIGGIO

[1-2 attività con descrizione immersiva. Luoghi specifici con nomi reali, non generici.]

### SERA

[Ristorante per cena specifico e narrativo. Dopo cena: suggerisci 1 bar, locale o passeggiata serale. Tutto con nomi reali.]

### HOTEL

[1 hotel coerente con spending level: nome reale, zona, perché è perfetto per questo itinerario. Se l'itinerario prevede spostamenti tra città diverse, indica un hotel per ogni tappa.]

---

[Separatore --- tra ogni giorno]

APERTURA E CHIUSURA:
- Apri con 2-3 frasi evocative sulla destinazione e lo spirito del viaggio (prima del Giorno 1, nessun titolo)
- Chiudi con un breve paragrafo poetico senza titolo (preceduto da ---)

REGOLE FONDAMENTALI:
- Nomi REALI sempre: ristoranti, bar, hotel, quartieri, strade — mai nomi generici o inventati
- Sii specifico e autentico, mai turistico o banale
- Bilancia poesia e praticità: ogni frase deve essere bella E utile
- Coerenza geografica: ogni giornata deve spostarsi in modo logico, minimizzando i trasferimenti inutili
- Adatta tono, ritmo e scelte allo stile e al budget richiesto`;

export async function POST(req: NextRequest) {
  const { destination, styles, spending, days } = await req.json();

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

  const stylesList = stylesArray
    .map((s) => STYLE_LABELS[s] ?? s)
    .join(", ");

  const spendingContext = buildSpendingContext(spending ?? 3);
  const spendingEmoji = "€".repeat(spending ?? 3);

  const userMessage = `Crea un itinerario di ${days} giorni a ${destination}.

STILI DI VIAGGIO RICHIESTI: ${stylesList}
BUDGET: ${spendingEmoji} — ${spendingContext}

Segui scrupolosamente la struttura per ogni giorno (## Giorno N, ### MATTINA, ### PRANZO, ### POMERIGGIO, ### SERA, ### HOTEL).
Scrivi in italiano, con il tuo stile narrativo editoriale. Usa nomi reali di luoghi, ristoranti e hotel.`;

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
