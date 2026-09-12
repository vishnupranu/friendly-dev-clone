import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My ideas — Lovable" },
      {
        name: "description",
        content: "Every idea you saved, with its description and how far along it is.",
      },
      { property: "og:title", content: "My ideas — Lovable" },
      {
        property: "og:description",
        content: "Every idea you saved, with its description and how far along it is.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Idea = {
  id: string;
  title: string;
  description: string;
  features: string;
  status: string;
  progress: number;
  created_at: string;
};

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { next: "/dashboard" } });
  }, [loading, user, navigate]);

  const load = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });
    setIdeas((data ?? []) as Idea[]);
    setFetching(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const setProgress = async (id: string, progress: number) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, progress } : i)));
    await supabase
      .from("ideas")
      .update({ progress, status: progress >= 100 ? "done" : progress > 0 ? "building" : "planned" })
      .eq("id", id);
  };

  const remove = async (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("ideas").delete().eq("id", id);
  };

  return (
    <div className="min-h-screen px-5 py-14">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-tight">My ideas</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {user?.email ? `Signed in as ${user.email}` : "Your saved ideas"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New idea
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="mt-16 flex justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="surface-card mt-10 p-10 text-center">
            <p className="text-muted-foreground">
              No ideas saved yet. Start one and it'll show up here.
            </p>
            <Link
              to="/build"
              className="mt-5 inline-flex rounded-full border border-border bg-secondary px-4 py-2 text-sm"
            >
              Browse idea starters
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {ideas.map((idea) => (
              <article key={idea.id} className="surface-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">{idea.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{idea.description}</p>
                  </div>
                  <button
                    onClick={() => remove(idea.id)}
                    aria-label={`Delete ${idea.title}`}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {idea.features && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {idea.features
                      .split("\n")
                      .map((f) => f.trim())
                      .filter(Boolean)
                      .map((f) => (
                        <li
                          key={f}
                          className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                        >
                          {f}
                        </li>
                      ))}
                  </ul>
                )}

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{idea.status}</span>
                    <span>{idea.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-[image:var(--gradient-warm)] transition-all"
                      style={{ width: `${idea.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={idea.progress}
                    onChange={(e) => setProgress(idea.id, Number(e.target.value))}
                    aria-label={`Progress for ${idea.title}`}
                    className="mt-3 w-full accent-[oklch(0.78_0.16_62)]"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
