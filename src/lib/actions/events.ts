"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { createEventSchema, updateEventSchema } from "@/lib/validators";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const raw = {
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    customTypeName: formData.get("customTypeName") as string || undefined,
    description: formData.get("description") as string || undefined,
    eventDate: formData.get("eventDate") as string || undefined,
    coverImage: formData.get("coverImage") as string || undefined,
  };

  const validated = createEventSchema.parse(raw);
  const slug = nanoid(8);

  const [event] = await db
    .insert(events)
    .values({
      userId: session.user.id,
      title: validated.title,
      type: validated.type,
      customTypeName: validated.customTypeName,
      slug,
      description: validated.description,
      eventDate: validated.eventDate ? new Date(validated.eventDate) : undefined,
      coverImage: validated.coverImage,
    })
    .returning();

  revalidatePath("/dashboard");
  redirect(`/events/${event.id}`);
}

export async function updateEvent(eventId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.userId, session.user.id)),
  });

  if (!existing) {
    throw new Error("Event not found");
  }

  const raw = {
    title: (formData.get("title") as string) || undefined,
    type: (formData.get("type") as string) || undefined,
    customTypeName: (formData.get("customTypeName") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    eventDate: (formData.get("eventDate") as string) || undefined,
    coverImage: (formData.get("coverImage") as string) || undefined,
  };

  const validated = updateEventSchema.parse(raw);

  await db
    .update(events)
    .set({
      ...validated,
      eventDate: validated.eventDate ? new Date(validated.eventDate) : existing.eventDate,
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId));

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/e/${existing.slug}`);
}

export async function deleteEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.userId, session.user.id)),
  });

  if (!existing) {
    throw new Error("Event not found");
  }

  await db.delete(events).where(eq(events.id, eventId));

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function toggleEventActive(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.events.findFirst({
    where: and(eq(events.id, eventId), eq(events.userId, session.user.id)),
  });

  if (!existing) {
    throw new Error("Event not found");
  }

  await db
    .update(events)
    .set({ isActive: !existing.isActive, updatedAt: new Date() })
    .where(eq(events.id, eventId));

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/e/${existing.slug}`);
}
