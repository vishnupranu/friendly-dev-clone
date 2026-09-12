import { createFileRoute } from "@tanstack/react-router";

const SCRIPT = `Welcome to Lovable. Build something lovable, without writing a single line of code.
Describe your idea in plain words, and watch it come to life in seconds.
Database, logins and publishing are all included, so you can go from a spark of an idea to a live product today.
Pick an idea below, shape its features, and start building.`;

export const Route = createFileRoute("/api/public/voiceover")({
  server: {
    handlers: {
      GET: async () => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Voiceover is not configured." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: SCRIPT,
            voice: "alloy",
            response_format: "mp3",
            instructions:
              "Speak warmly and confidently, like a friendly product narrator. Unhurried pacing.",
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          return new Response(
            JSON.stringify({ error: "Could not generate the voiceover.", detail }),
            {
              status: upstream.status,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
