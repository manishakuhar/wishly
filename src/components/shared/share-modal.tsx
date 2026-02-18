"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { generateShareUrl, generateWhatsAppUrl } from "@/lib/utils";
import { toast } from "sonner";

interface ShareModalProps {
  slug: string;
  eventTitle: string;
  hostName: string;
}

export function ShareModal({ slug, eventTitle, hostName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = generateShareUrl(slug);

  const whatsappText = `\u{1F381} ${hostName} created a wish list for ${eventTitle}!\n\nCheck out what they'd love to receive:\n${shareUrl}\n\nNo more guessing what to get! \u{1F389}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your gift registry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="bg-muted" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            className="w-full gap-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5A]"
            asChild
          >
            <a
              href={generateWhatsAppUrl(whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
