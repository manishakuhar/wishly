"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/lib/actions/events";
import { toast } from "sonner";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this event? All gifts and claims will be removed."
      )
    ) {
      return;
    }
    try {
      await deleteEvent(eventId);
    } catch (error) {
      toast.error("Failed to delete event");
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
