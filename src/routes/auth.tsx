import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search["next"] === "string" ? (search["next"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign up or log in — Lovable" },
      {
        name: "description",
        content: "Create your Lovable account to save your app ideas and track their progress.",
      },
      { property: "og:title", content: "Sign up or log in — Lovable" },
      {
        property: "og:description",
        content: "Create your Lovable account to save your app ideas and track their progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthPage() {
  const { next } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useAuth();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const target = safePath(next);

  useEffect(() => {
    if (!sessionLoading && session) navigate({ to: target });
  }, [session, sessionLoading, navigate, target]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${target}` },
      });
      if (signUpError) setError(signUpError.message);
      else if (!data.session) setMessage("Check your inbox to confirm your email, then log in.");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
    }
    setBusy(false);
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in didn't work. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: target });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-glow" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-warm)]">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-xl">Lovable</span>
        </Link>

        <div className="surface-card p-7">
          <h1 className="font-display text-3xl tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Save your ideas and pick up where you left off.
          </p>

          <button
            onClick={google}
            className="mt-6 w-full rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-primary">{message}</p>}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signup" ? "Sign up" : "Log in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-foreground underline underline-offset-4"
            >
              {mode === "signup" ? "Log in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
