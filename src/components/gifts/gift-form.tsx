"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import { addGift, updateGift } from "@/lib/actions/gifts";
import { toast } from "sonner";

interface GiftFormProps {
  eventId: string;
  gift?: {
    id: string;
    name: string;
    link: string | null;
    price: number | null;
    image: string | null;
    notes: string | null;
  };
}

export function GiftForm({ eventId, gift }: GiftFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = !!gift;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (isEditing) {
        await updateGift(gift.id, formData);
        toast.success("Gift updated");
      } else {
        await addGift(eventId, formData);
        toast.success("Gift added");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Gift
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Gift" : "Add Gift"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Gift name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., AirPods Pro"
              required
              defaultValue={gift?.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">
              Product link{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="link"
              name="link"
              type="url"
              placeholder="https://amazon.in/..."
              defaultValue={gift?.link || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price in INR{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 2499"
              defaultValue={
                gift?.price ? (gift.price / 100).toString() : ""
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Image URL{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://..."
              defaultValue={gift?.image || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="e.g., Color preference: blue"
              maxLength={500}
              rows={2}
              defaultValue={gift?.notes || ""}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
                ? "Update Gift"
                : "Add Gift"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
