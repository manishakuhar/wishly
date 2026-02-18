"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gifts, events } from "@/lib/db/schema";
import { createGiftSchema, updateGiftSchema } from "@/lib/validators";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function verifyEventOwnership(eventId: string, userId: string) {
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.userId, userId)),
  });
  if (!event) throw new Error("Event not found");
  return event;
}

async function verifyGiftOwnership(giftId: string, userId: string) {
  const gift = await db.query.gifts.findFirst({
    where: eq(gifts.id, giftId),
    with: {
      event: { columns: { id: true, userId: true, slug: true } },
    },
  });
  if (!gift || gift.event.userId !== userId) throw new Error("Gift not found");
  return gift;
}

export async function addGift(eventId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const event = await verifyEventOwnership(eventId, session.user.id);

  // Check gift limit (20 per event)
  const existingGifts = await db.query.gifts.findMany({
    where: eq(gifts.eventId, eventId),
    columns: { id: true },
  });
  if (existingGifts.length >= 20) {
    throw new Error("Maximum 20 gifts per event");
  }

  const raw = {
    name: formData.get("name") as string,
    link: (formData.get("link") as string) || undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    image: (formData.get("image") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const validated = createGiftSchema.parse(raw);

  await db.insert(gifts).values({
    eventId,
    name: validated.name,
    link: validated.link || null,
    price: validated.price || null,
    image: validated.image || null,
    notes: validated.notes || null,
    priority: existingGifts.length,
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/e/${event.slug}`);
}

export async function updateGift(giftId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const gift = await verifyGiftOwnership(giftId, session.user.id);

  const raw = {
    name: (formData.get("name") as string) || undefined,
    link: (formData.get("link") as string) || undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    image: (formData.get("image") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const validated = updateGiftSchema.parse(raw);

  await db
    .update(gifts)
    .set({
      ...validated,
      link: validated.link || null,
      image: validated.image || null,
      notes: validated.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(gifts.id, giftId));

  revalidatePath(`/events/${gift.event.id}`);
  revalidatePath(`/e/${gift.event.slug}`);
}

export async function deleteGift(giftId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const gift = await verifyGiftOwnership(giftId, session.user.id);

  await db.delete(gifts).where(eq(gifts.id, giftId));

  revalidatePath(`/events/${gift.event.id}`);
  revalidatePath(`/e/${gift.event.slug}`);
}
