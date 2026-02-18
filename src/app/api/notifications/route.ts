import { auth } from "@/lib/auth";
import { getUserNotifications, getUnreadCount } from "@/lib/services/notifications";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [notifs, unreadCount] = await Promise.all([
    getUserNotifications(session.user.id),
    getUnreadCount(session.user.id),
  ]);

  return NextResponse.json({ notifications: notifs, unreadCount });
}
