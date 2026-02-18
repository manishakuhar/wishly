import { auth } from "@/lib/auth";
import { getEventById } from "@/lib/queries/events";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GiftCard } from "@/components/gifts/gift-card";
import { GiftForm } from "@/components/gifts/gift-form";
import { ShareModal } from "@/components/shared/share-modal";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import {
  formatDate,
  getEventTypeLabel,
  getEventTypeEmoji,
} from "@/lib/utils";
import { Calendar, Gift } from "lucide-react";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const event = await getEventById(id);

  if (!event || event.userId !== session.user.id) {
    notFound();
  }

  const claimedCount = event.gifts.filter((g) => g.isClaimed).length;

  return (
    <div className="space-y-8">
      {/* Event Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getEventTypeEmoji(event.type)}</span>
            <h1 className="font-heading text-2xl font-bold">{event.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
            {event.eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(event.eventDate)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Gift className="h-3.5 w-3.5" />
              {claimedCount}/{event.gifts.length} claimed
            </span>
          </div>
          {event.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <ShareModal
            slug={event.slug}
            eventTitle={event.title}
            hostName={event.user.name || "Someone"}
          />
          <DeleteEventButton eventId={event.id} />
        </div>
      </div>

      {/* Gift Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">
            Gifts ({event.gifts.length}/20)
          </h2>
          {event.gifts.length < 20 && <GiftForm eventId={event.id} />}
        </div>

        {event.gifts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Gift className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="mb-4 text-muted-foreground">
                No gifts added yet. Add gifts to your registry!
              </p>
              <GiftForm eventId={event.id} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.gifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                eventId={event.id}
                isHost={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
