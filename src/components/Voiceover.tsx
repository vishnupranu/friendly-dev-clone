import { useState } from "react";
import { Loader2, Play, Volume2 } from "lucide-react";

export function Voiceover() {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/voiceover");
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      setSrc(URL.createObjectURL(blob));
    } catch {
      setError("The voiceover couldn't be generated right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card mx-auto mt-8 flex max-w-xl flex-col gap-3 p-4 text-left sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <Volume2 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium">Hear the pitch</p>
          <p className="text-xs text-muted-foreground">An AI voiceover of this page</p>
        </div>
      </div>

      {src ? (
        <audio controls autoPlay src={src} className="w-full sm:w-64" />
      ) : (
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {loading ? "Generating…" : "Play voiceover"}
        </button>
      )}
      {error && <p className="text-xs text-destructive sm:w-48">{error}</p>}
    </div>
  );
}
