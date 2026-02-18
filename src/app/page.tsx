import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Gift,
  Share2,
  CheckCircle,
  Users,
  Sparkles,
  Heart,
  Smartphone,
} from "lucide-react";

const EVENT_TYPES = [
  { emoji: "\u{1F382}", label: "Birthdays" },
  { emoji: "\u{1F492}", label: "Weddings" },
  { emoji: "\u{1F3E0}", label: "Housewarmings" },
  { emoji: "\u{1F476}", label: "Baby Showers" },
  { emoji: "\u{1F496}", label: "Anniversaries" },
  { emoji: "\u{1F381}", label: "Any Occasion" },
];

const STEPS = [
  {
    icon: Gift,
    title: "Create your list",
    description: "Add gifts you'd love to receive. Just a name is enough — price and links are optional.",
  },
  {
    icon: Share2,
    title: "Share with guests",
    description: "Send your unique link via WhatsApp, text, or social media. One tap to share.",
  },
  {
    icon: CheckCircle,
    title: "Guests claim gifts",
    description: "Guests pick what they'll bring. No duplicates, no guessing, no awkward moments.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Free forever",
    description: "No hidden fees, no premium tiers. Create unlimited registries.",
  },
  {
    icon: Smartphone,
    title: "Mobile-friendly",
    description: "Guests open your link on their phone and claim in seconds.",
  },
  {
    icon: Users,
    title: "WhatsApp sharing",
    description: "Pre-formatted message with your link. One tap to share with groups.",
  },
  {
    icon: Heart,
    title: "Get what you want",
    description: "No more unwanted gifts collecting dust. Guests know exactly what to get.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Gift className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold">Wishly</span>
          </Link>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Create gift lists your guests will{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              actually use
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
            No more duplicate gifts, awkward guessing, or last-minute scrambles.
            Share what you really want and let guests claim it.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-xl px-8 text-base">
              <Link href="/login">Create your wish list</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              100% free. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      {/* Event types */}
      <section className="border-y bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            Perfect for any occasion
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {EVENT_TYPES.map((type) => (
              <div
                key={type.label}
                className="flex flex-col items-center gap-1 rounded-xl border bg-background p-3 text-center"
              >
                <span className="text-2xl">{type.emoji}</span>
                <span className="text-xs font-medium">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-1 text-xs font-semibold text-primary">
                  Step {i + 1}
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold">
            Why Wishly?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-heading font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h2 className="font-heading text-3xl font-bold">
            Ready to simplify gift-giving?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Create your first registry in under a minute. Completely free.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-xl px-8 text-base">
            <Link href="/login">Get started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Gift className="h-3 w-3 text-primary" />
            </div>
            <span className="font-heading text-sm font-semibold">Wishly</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Made with love in India
          </p>
        </div>
      </footer>
    </div>
  );
}
