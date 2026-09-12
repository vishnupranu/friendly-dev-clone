import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { findIdea, ideaTemplates } from "@/lib/ideas";

export const Route = createFileRoute("/build")({
  validateSearch: (search: Record<string, unknown>) => ({
    idea: typeof search["idea"] === "string" ? (search["idea"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Define your app's features — Lovable" },
      {
        name: "description",
        content:
          "Shape your idea: name it, describe it and list the features you want, then save it to build later.",
      },
      { property: "og:title", content: "Define your app's features — Lovable" },
      {
        property: "og:description",
        content:
          "Shape your idea: name it, describe it and list the features you want, then save it to build later.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildPage,
});

function BuildPage() {
  const { idea: slug } = useSearch({ from: "/build" });
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const template = useMemo(() => findIdea(slug), [slug]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState(template?.title ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [features, setFeatures] = useState(template?.suggestedFeatures.join("\n") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(template?.title ?? "");
    setDescription(template?.description ?? "");
    setFeatures(template?.suggestedFeatures.join("\n") ?? "");
    setShowForm(false);
  }, [template]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({
        to: "/auth",
        search: { next: `/build${slug ? `?idea=${slug}` : ""}` },
      });
      return;
    }
    setSaving(true);
    setError(null);
    const { error: insertError } = await supabase.from("ideas").insert({
      user_id: user.id,
      title,
      description,
      features,
      status: "planned",
      progress: 0,
    });
    setSaving(false);
    if (insertError) {
      setError("We couldn't save this idea. Please try again.");
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen px-5 py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-glow" />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            My ideas →
          </Link>
        </div>

        {!template ? (
          <div className="mt-10">
            <h1 className="font-display text-4xl tracking-tight">Pick an idea to shape</h1>
            <p className="mt-3 text-muted-foreground">
              Choose a starting point, then describe the features you want.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ideaTemplates.map((t) => (
                <Link
                  key={t.slug}
                  to="/build"
                  search={{ idea: t.slug }}
                  className="surface-card p-6 transition-colors hover:border-primary/50"
                >
                  <h2 className="font-medium">{t.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> App idea
            </span>
            <h1 className="mt-5 font-display text-5xl leading-tight tracking-tight">
              {template.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{template.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {template.suggestedFeatures.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Build it
              </button>
            )}

            {showForm && (
              <form onSubmit={save} className="surface-card mt-8 space-y-4 p-7">
                <h2 className="font-display text-2xl">Define your features</h2>
                <div>
                  <label htmlFor="title" className="text-sm text-muted-foreground">
                    Name
                  </label>
                  <input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="text-sm text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full resize-none rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label htmlFor="features" className="text-sm text-muted-foreground">
                    Features — one per line
                  </label>
                  <textarea
                    id="features"
                    rows={6}
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="mt-1 w-full resize-none rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
                {!loading && !user && (
                  <p className="text-sm text-muted-foreground">
                    You'll be asked to sign up so this idea is saved to your account.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save this idea
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
