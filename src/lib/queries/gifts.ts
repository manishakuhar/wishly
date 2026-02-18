import { db } from "@/lib/db";
import { gifts, claims } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getGiftById(id: string) {
  return db.query.gifts.findFirst({
    where: eq(gifts.id, id),
    with: {
      event: {
        columns: { id: true, userId: true, title: true, slug: true },
      },
      claim: {
        with: {
          user: {
            columns: { id: true, name: true, image: true },
          },
        },
      },
    },
  });
}

export async function getGiftsByEventId(eventId: string) {
  return db.query.gifts.findMany({
    where: eq(gifts.eventId, eventId),
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
  });
}
