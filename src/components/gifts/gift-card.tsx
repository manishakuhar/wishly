"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { GiftForm } from "./gift-form";
import { deleteGift } from "@/lib/actions/gifts";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface GiftCardProps {
  gift: {
    id: string;
    name: string;
    link: string | null;
    price: number | null;
    image: string | null;
    notes: string | null;
    isClaimed: boolean;
    claim?: {
      user: {
        name: string | null;
        image: string | null;
      };
      message: string | null;
    } | null;
  };
  eventId: string;
  isHost: boolean;
}

export function GiftCard({ gift, eventId, isHost }: GiftCardProps) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to remove this gift?")) return;
    try {
      await deleteGift(gift.id);
      toast.success("Gift removed");
    } catch (error) {
      toast.error("Failed to remove gift");
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-md ${
        gift.isClaimed ? "opacity-75" : ""
      }`}
    >
      {gift.image && (
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={gift.image}
            alt={gift.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2">{gift.name}</h3>
          {gift.isClaimed ? (
            <Badge variant="secondary" className="shrink-0 bg-accent/10 text-accent-foreground">
              Claimed
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0">
              Available
            </Badge>
          )}
        </div>

        {gift.price && (
          <p className="mb-2 text-sm font-semibold text-primary">
            {formatPrice(gift.price)}
          </p>
        )}

        {gift.notes && (
          <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
            {gift.notes}
          </p>
        )}

        {gift.isClaimed && gift.claim?.user && (
          <p className="mb-2 text-xs text-muted-foreground">
            Claimed by {gift.claim.user.name}
            {gift.claim.message && ` — "${gift.claim.message}"`}
          </p>
        )}

        <div className="flex items-center gap-1">
          {gift.link && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <a href={gift.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {isHost && (
            <>
              <GiftForm eventId={eventId} gift={gift} />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
