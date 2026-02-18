import { auth } from "@/lib/auth";
import { markAsRead } from "@/lib/services/notifications";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await markAsRead(id, session.user.id);

  return NextResponse.json({ success: true });
}
