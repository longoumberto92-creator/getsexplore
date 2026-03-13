import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const STYLE_LABELS: Record<string, string> = {
  avventura: "avventura e adrenalina — hiking, sport estremi, esperienze fuori dai sentieri battuti",
  lusso: "lusso e raffinatezza — hotel boutique, ristoranti stellati, esperienze esclusive",
  cultura: "cultura e storia — musei, siti UNESCO, architettura, incontri con la gente del posto",
  cibo: "gastronomia e food culture — mercati locali, chef table, street food autentico, vino",
  natura: "natura e slow travel — parchi naturali, alba in montagna, silenzio e paesaggi mozzafiato",
};

const SYSTEM_PROMPT = `Sei GetSXplore, un travel companion AI che crea itinerari di viaggio narrativi e immersivi in italiano.
Il tuo stile è editoriale di lusso — come un articolo di Condé Nast Traveller o un pezzo di National Geographic.

Non elenchi posti: racconti esperienze. Ogni giorno ha un filo narrativo, un'emozione, un ritmo.

FORMATO OBBLIGATORIO:
- Apri con 2-3 frasi evocative sulla destinazione e lo spirito del viaggio (nessun titolo, testo libero)
- Per ogni giornata usa esattamente: "## Giorno N — [Titolo Poetico]" seguito da un punto a capo
- Ogni giornata: mattina, pomeriggio, sera — narrati come un racconto continuo, non come lista
- Chiudi con un breve paragrafo poetico senza titolo ("---" prima come separatore)

REGOLE:
- Nomi reali: ristoranti, quartieri, strade, locali — mai generici
- Sii specifico e autentico, mai turistico o banale
- Bilancia poesia e praticità: ogni frase deve essere bella E utile
- Adatta tono e ritmo allo stile richiesto dal viaggiatore`;

export async function POST(req: NextRequest) {
  const { destination, style, days } = await req.json();

  if (!destination || !style || !days) {
    return Response.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key non configurata" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const styleLabel = STYLE_LABELS[style] ?? style;

  const userMessage = `Crea un itinerario di ${days} giorni a ${destination}.
Stile di viaggio: ${styleLabel}.
Scrivi in italiano, con il tuo stile narrativo editoriale.`;

  // Stream the response directly to the client
  const stream = client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
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
