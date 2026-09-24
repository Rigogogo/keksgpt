import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing AI key", { status: 500 });

        const body = (await request.json()) as {
          messages: Msg[];
          flavor?: string;
          language?: string;
        };
        const flavor = body.flavor ?? "Schoko";
        const language = body.language ?? "Deutsch";

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-3.7-flash",
            stream: true,
            messages: [
              {
                role: "system",
                content: `Du bist Keks GPT, ein hilfsbereiter, warmherziger KI-Assistent mit Keks-Persönlichkeit. Aktuelle Kekssorte: ${flavor}. Antworte grundsätzlich auf ${language} (oder in der Sprache des Nutzers, falls er eine andere schreibt), klar und hilfreich. Streue gelegentlich – sparsam – einen kleinen Keks-Witz oder eine Keks-Metapher ein, aber gehe immer zuerst ernsthaft auf die Frage ein. Nutze Markdown.`,
              },
              ...body.messages,
            ],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          const message =
            res.status === 429
              ? "Zu viele Anfragen – bitte kurz warten."
              : res.status === 402
                ? "Das KI-Guthaben ist aufgebraucht. Bitte in Lovable aufladen."
                : `KI-Fehler (${res.status}): ${text.slice(0, 200)}`;
          return new Response(message, { status: res.status });
        }

        const stream = new ReadableStream({
          async start(controller) {
            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let buf = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  const t = line.trim();
                  if (!t.startsWith("data:")) continue;
                  const data = t.slice(5).trim();
                  if (data === "[DONE]") continue;
                  try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch {
                    /* ignore partial */
                  }
                }
              }
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
