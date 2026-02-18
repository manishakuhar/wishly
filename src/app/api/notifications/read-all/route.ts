import { auth } from "@/lib/auth";
import { markAllAsRead } from "@/lib/services/notifications";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markAllAsRead(session.user.id);

  return NextResponse.json({ success: true });
}
