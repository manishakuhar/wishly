import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Page not found
        </h1>
        <p className="mb-6 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="rounded-xl">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
