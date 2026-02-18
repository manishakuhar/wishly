import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/queries/events";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { GuestGiftCard } from "@/components/gifts/guest-gift-card";
import {
  formatDate,
  getEventTypeLabel,
  getEventTypeEmoji,
} from "@/lib/utils";
import { Calendar, Gift } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: `${event.user.name} has created a gift registry. View their wishlist and claim a gift!`,
    openGraph: {
      title: `${event.title} | Wishly`,
      description: `Gift registry by ${event.user.name}. Browse and claim gifts!`,
      images: event.coverImage ? [event.coverImage] : [],
    },
  };
}

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();
  if (!event.isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">
            This registry is no longer active
          </h1>
          <p className="mt-2 text-muted-foreground">
            The host has closed this gift registry.
          </p>
        </div>
      </div>
    );
  }

  const session = await auth();
  const currentUserId = session?.user?.id;
  const isHost = currentUserId === event.userId;
  const claimedCount = event.gifts.filter((g) => g.isClaimed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/3 to-background">
      {/* Minimal header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Gift className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-heading text-lg font-bold">Wishly</span>
          </Link>
          {currentUserId && (
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              My Dashboard
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Event header */}
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block text-4xl">
            {getEventTypeEmoji(event.type)}
          </span>
          <h1 className="font-heading text-3xl font-bold">{event.title}</h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>by {event.user.name}</span>
            <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
            {event.eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(event.eventDate)}
              </span>
            )}
          </div>
          {event.description && (
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {event.description}
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            {claimedCount} of {event.gifts.length} gifts claimed
          </p>
        </div>

        {/* Gift grid */}
        {event.gifts.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No gifts have been added yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {event.gifts.map((gift) => (
              <GuestGiftCard
                key={gift.id}
                gift={gift}
                slug={slug}
                currentUserId={currentUserId}
                isHost={isHost}
              />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Want to create your own gift registry?
          </p>
          <Link
            href="/login"
            className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
          >
            Get started with Wishly
          </Link>
        </div>
      </main>
    </div>
  );
}
