"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check } from "lucide-react";
import { ClaimDialog } from "./claim-dialog";
import { formatPrice } from "@/lib/utils";

interface GuestGiftCardProps {
  gift: {
    id: string;
    name: string;
    link: string | null;
    price: number | null;
    image: string | null;
    notes: string | null;
    isClaimed: boolean;
    claim?: {
      userId: string;
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
      message: string | null;
    } | null;
  };
  slug: string;
  currentUserId?: string;
  isHost: boolean;
}

export function GuestGiftCard({
  gift,
  slug,
  currentUserId,
  isHost,
}: GuestGiftCardProps) {
  const isClaimedByMe =
    gift.isClaimed && gift.claim?.userId === currentUserId;

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-md ${
        gift.isClaimed ? "opacity-80" : ""
      }`}
    >
      {gift.image && (
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={gift.image}
            alt={gift.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2">{gift.name}</h3>
          {gift.isClaimed ? (
            <Badge
              variant="secondary"
              className="shrink-0 bg-accent/10 text-accent-foreground"
            >
              <Check className="mr-1 h-3 w-3" />
              {isClaimedByMe ? "You claimed this" : "Claimed"}
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
          <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
            {gift.notes}
          </p>
        )}

        <div className="flex items-center gap-2">
          {gift.link && (
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a href={gift.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                View Product
              </a>
            </Button>
          )}
          {!gift.isClaimed && !isHost && (
            <ClaimDialog
              giftId={gift.id}
              giftName={gift.name}
              slug={slug}
              isLoggedIn={!!currentUserId}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
