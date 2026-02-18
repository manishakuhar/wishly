"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { claims, gifts, events, users } from "@/lib/db/schema";
import { claimGiftSchema } from "@/lib/validators";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/services/notifications";
import { sendGiftClaimedEmail, sendClaimConfirmationEmail } from "@/lib/services/email";
import { generateShareUrl } from "@/lib/utils";

export async function claimGift(giftId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to claim a gift" };

  const gift = await db.query.gifts.findFirst({
    where: eq(gifts.id, giftId),
    with: {
      event: {
        columns: { id: true, userId: true, slug: true, title: true },
        with: {
          user: { columns: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!gift) return { error: "Gift not found" };
  if (gift.event.userId === session.user.id) {
    return { error: "You cannot claim your own gift" };
  }
  if (gift.isClaimed) return { error: "This gift has already been claimed" };

  const raw = {
    message: (formData.get("message") as string) || undefined,
  };
  const validated = claimGiftSchema.parse(raw);

  // Use unique constraint on claims.giftId to handle race conditions
  try {
    await db.insert(claims).values({
      giftId,
      userId: session.user.id,
      message: validated.message || null,
    });

    await db
      .update(gifts)
      .set({ isClaimed: true, updatedAt: new Date() })
      .where(eq(gifts.id, giftId));
  } catch (error: unknown) {
    // Unique constraint violation means someone else claimed first
    if (
      error instanceof Error &&
      error.message.includes("unique")
    ) {
      return { error: "This gift was just claimed by someone else" };
    }
    return { error: "Something went wrong. Please try again." };
  }

  // Send notifications (fire-and-forget, don't block the response)
  const host = gift.event.user;
  const claimerName = session.user.name || "Someone";

  createNotification({
    userId: host.id,
    type: "claim",
    title: `${gift.name} was claimed!`,
    message: `${claimerName} claimed ${gift.name} from ${gift.event.title}`,
    metadata: { eventId: gift.event.id, giftId: gift.id },
  }).catch(() => {});

  if (host.email) {
    sendGiftClaimedEmail({
      hostEmail: host.email,
      hostName: host.name || "there",
      giftName: gift.name,
      claimerName,
      eventTitle: gift.event.title,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/events/${gift.event.id}`,
      message: validated.message,
    }).catch(() => {});
  }

  if (session.user.email) {
    sendClaimConfirmationEmail({
      guestEmail: session.user.email,
      guestName: claimerName,
      giftName: gift.name,
      eventTitle: gift.event.title,
      giftLink: gift.link,
    }).catch(() => {});
  }

  revalidatePath(`/e/${gift.event.slug}`);
  revalidatePath(`/events/${gift.event.id}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function unclaimGift(giftId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in" };

  const claim = await db.query.claims.findFirst({
    where: and(eq(claims.giftId, giftId), eq(claims.userId, session.user.id)),
  });

  if (!claim) return { error: "Claim not found" };

  const gift = await db.query.gifts.findFirst({
    where: eq(gifts.id, giftId),
    with: {
      event: { columns: { id: true, slug: true } },
    },
  });

  await db.delete(claims).where(eq(claims.id, claim.id));
  await db
    .update(gifts)
    .set({ isClaimed: false, updatedAt: new Date() })
    .where(eq(gifts.id, giftId));

  if (gift) {
    revalidatePath(`/e/${gift.event.slug}`);
    revalidatePath(`/events/${gift.event.id}`);
  }
  revalidatePath("/dashboard");

  return { success: true };
}
