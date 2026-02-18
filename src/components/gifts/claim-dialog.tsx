"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Gift, PartyPopper } from "lucide-react";
import { claimGift } from "@/lib/actions/claims";
import { toast } from "sonner";

interface ClaimDialogProps {
  giftId: string;
  giftName: string;
  slug: string;
  isLoggedIn: boolean;
}

export function ClaimDialog({
  giftId,
  giftName,
  slug,
  isLoggedIn,
}: ClaimDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const router = useRouter();

  function handleTrigger() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/e/${slug}`);
      return;
    }
    setOpen(true);
  }

  async function handleClaim(formData: FormData) {
    setLoading(true);
    try {
      await claimGift(giftId, formData);
      setClaimed(true);
      toast.success("Gift claimed!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to claim gift"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-1.5 rounded-xl"
          size="sm"
          onClick={handleTrigger}
        >
          <Gift className="h-3.5 w-3.5" />
          I&apos;ll get this
        </Button>
      </DialogTrigger>
      <DialogContent>
        {claimed ? (
          <div className="py-6 text-center">
            <PartyPopper className="mx-auto mb-4 h-12 w-12 text-accent" />
            <h2 className="mb-2 font-heading text-xl font-bold">
              You claimed it!
            </h2>
            <p className="text-muted-foreground">
              {giftName} is now marked as claimed. The host will be able to see
              your commitment.
            </p>
            <Button
              className="mt-6 rounded-xl"
              onClick={() => {
                setOpen(false);
                setClaimed(false);
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Claim &quot;{giftName}&quot;?</DialogTitle>
              <DialogDescription>
                This lets the host know you&apos;ll be getting this gift. Other
                guests won&apos;t be able to claim it.
              </DialogDescription>
            </DialogHeader>
            <form action={handleClaim} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">
                  Leave a message{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="e.g., Can't wait to see your reaction!"
                  maxLength={500}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl"
                  disabled={loading}
                >
                  {loading ? "Claiming..." : "Confirm Claim"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
