"use client";

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <Gift className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Something went wrong
        </h1>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} className="rounded-xl">
          Try again
        </Button>
      </div>
    </div>
  );
}
