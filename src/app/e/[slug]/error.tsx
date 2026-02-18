"use client";

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import Link from "next/link";

export default function EventError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Couldn&apos;t load this registry
        </h1>
        <p className="mb-6 text-muted-foreground">
          Something went wrong. Please try refreshing the page.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="rounded-xl">
            Try again
          </Button>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
