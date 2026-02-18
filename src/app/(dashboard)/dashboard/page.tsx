import { auth } from "@/lib/auth";
import { getUserEvents } from "@/lib/queries/events";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Gift, Calendar } from "lucide-react";
import { formatDate, getEventTypeLabel, getEventTypeEmoji } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const events = await getUserEvents(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">My Events</h1>
          <p className="text-muted-foreground">
            Manage your gift registries
          </p>
        </div>
        <Button asChild className="gap-2 rounded-xl">
          <Link href="/events/new">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 font-heading text-xl font-semibold">
              No events yet
            </h2>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Create your first gift registry and share it with friends and
              family.
            </p>
            <Button asChild className="gap-2 rounded-xl">
              <Link href="/events/new">
                <Plus className="h-4 w-4" />
                Create your first event
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-2xl">
                      {getEventTypeEmoji(event.type)}
                    </span>
                    <Badge
                      variant={event.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {event.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <h3 className="mb-1 font-heading text-lg font-semibold line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {getEventTypeLabel(event.type)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Gift className="h-3.5 w-3.5" />
                      {event.claimedCount}/{event.giftCount} claimed
                    </span>
                    {event.eventDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(event.eventDate)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
