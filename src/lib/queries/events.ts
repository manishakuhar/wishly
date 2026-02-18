import { db } from "@/lib/db";
import { events, gifts, claims, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getEventBySlug(slug: string) {
  const result = await db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: {
      user: {
        columns: { id: true, name: true, image: true },
      },
      gifts: {
        orderBy: [gifts.priority, gifts.createdAt],
        with: {
          claim: {
            with: {
              user: {
                columns: { id: true, name: true, image: true },
              },
            },
          },
        },
      },
    },
  });

  return result;
}

export async function getEventById(id: string) {
  const result = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      user: {
        columns: { id: true, name: true, image: true },
      },
      gifts: {
        orderBy: [gifts.priority, gifts.createdAt],
        with: {
          claim: {
            with: {
              user: {
                columns: { id: true, name: true, image: true },
              },
            },
          },
        },
      },
    },
  });

  return result;
}

export async function getUserEvents(userId: string) {
  const result = await db.query.events.findMany({
    where: eq(events.userId, userId),
    orderBy: [desc(events.createdAt)],
    with: {
      gifts: {
        columns: { id: true, isClaimed: true },
      },
    },
  });

  return result.map((event) => ({
    ...event,
    giftCount: event.gifts.length,
    claimedCount: event.gifts.filter((g) => g.isClaimed).length,
  }));
}
