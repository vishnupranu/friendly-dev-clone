import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUp,
  Paperclip,
  Sparkles,
  Globe,
  Database,
  ShieldCheck,
  Zap,
  Github,
  Figma,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lovable — Build software by chatting with AI" },
      {
        name: "description",
        content:
          "Describe your idea in plain words and get a working web app with database, login and deploy in minutes.",
      },
      { property: "og:title", content: "Lovable — Build software by chatting with AI" },
      {
        property: "og:description",
        content:
          "Describe your idea in plain words and get a working web app with database, login and deploy in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const suggestions = [
  "A booking app for a yoga studio",
  "An internal CRM dashboard",
  "A personal portfolio with a blog",
  "A marketplace for vintage cameras",
];

const features = [
  {
    icon: Zap,
    title: "Chat to build",
    text: "Describe a change in plain words and watch the live preview update in seconds.",
  },
  {
    icon: Database,
    title: "Backend included",
    text: "Database, file storage and server logic are wired up for you — no setup, no accounts.",
  },
  {
    icon: ShieldCheck,
    title: "Logins that just work",
    text: "Sign-up, sign-in and permissions come ready and secure out of the box.",
  },
  {
    icon: Globe,
    title: "Publish anywhere",
    text: "One click to go live, then connect your own domain whenever you're ready.",
  },
];

const showcase = [
  { name: "Nimbus Analytics", tag: "Dashboard", hue: "from-primary/25" },
  { name: "Pocket Recipes", tag: "Mobile web", hue: "from-accent/25" },
  { name: "Studio Booking", tag: "Marketplace", hue: "from-primary/20" },
  { name: "Habit Streaks", tag: "Productivity", hue: "from-accent/20" },
  { name: "Field Notes CRM", tag: "Internal tool", hue: "from-primary/25" },
  { name: "Launch Letters", tag: "Newsletter", hue: "from-accent/25" },
];

function Index() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-warm)]">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-xl tracking-tight">Lovable</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#showcase" className="transition-colors hover:text-foreground">
              Showcase
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block">
              Log in
            </button>
            <button className="rounded-full bg-[image:var(--gradient-warm)] px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Get started
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-glow" />
          <div className="relative mx-auto max-w-3xl px-5 pt-24 pb-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Now with agent mode and instant publishing
            </span>
            <h1 className="mt-7 font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
              Build something <span className="text-gradient">Lovable</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Create apps and websites by chatting with AI. No code, no setup — just describe
              what you want.
            </p>

            <div className="surface-card mt-10 p-3 text-left">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Ask Lovable to create a booking app for my studio..."
                className="w-full resize-none bg-transparent px-3 py-3 text-base outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between px-1 pb-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                    <Github className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 transition-colors hover:bg-secondary hover:text-foreground">
                    <Figma className="h-4 w-4" />
                  </button>
                </div>
                <button
                  aria-label="Send prompt"
                  className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-warm)] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  disabled={!prompt.trim()}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-4xl tracking-tight">Everything comes included</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            From the first idea to a live product, the pieces you'd normally wire up yourself are
            already there.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="surface-card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Showcase */}
        <section id="showcase" className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl tracking-tight">Made with Lovable</h2>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Browse the gallery →
            </a>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p) => (
              <article key={p.name} className="surface-card group overflow-hidden">
                <div
                  className={`h-44 bg-gradient-to-br ${p.hue} to-transparent transition-transform duration-500 group-hover:scale-[1.03]`}
                />
                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-5 py-20">
          <h2 className="text-center font-display text-4xl tracking-tight">
            Start free, grow when you need to
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", note: "5 daily credits to explore", cta: "Start building" },
              { name: "Pro", price: "$25", note: "100 monthly credits, private apps", cta: "Go Pro", featured: true },
              { name: "Teams", price: "$30", note: "Shared workspaces and roles", cta: "Contact sales" },
            ].map((t) => (
              <div
                key={t.name}
                className={`surface-card p-7 ${t.featured ? "ring-1 ring-primary/60" : ""}`}
              >
                <span className="text-sm text-muted-foreground">{t.name}</span>
                <p className="mt-3 font-display text-4xl">
                  {t.price}
                  <span className="text-base text-muted-foreground">/mo</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{t.note}</p>
                <button
                  className={`mt-6 w-full rounded-full px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${
                    t.featured
                      ? "bg-[image:var(--gradient-warm)] text-primary-foreground"
                      : "border border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  {t.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden px-5 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-glow" />
          <div className="relative">
            <h2 className="font-display text-5xl tracking-tight">
              Your idea, live <span className="text-gradient">today</span>
            </h2>
            <button className="mt-8 rounded-full bg-[image:var(--gradient-warm)] px-7 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Start building free
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
          <span className="font-display text-base text-foreground">Lovable</span>
          <span>© {new Date().getFullYear()} Lovable. Built by chatting.</span>
        </div>
      </footer>
    </div>
  );
}
