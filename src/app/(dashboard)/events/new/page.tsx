"use client";

import { createEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

const EVENT_TYPES = [
  { value: "birthday", label: "Birthday", emoji: "\u{1F382}" },
  { value: "wedding", label: "Wedding", emoji: "\u{1F492}" },
  { value: "housewarming", label: "Housewarming", emoji: "\u{1F3E0}" },
  { value: "baby_shower", label: "Baby Shower", emoji: "\u{1F476}" },
  { value: "anniversary", label: "Anniversary", emoji: "\u{1F496}" },
  { value: "custom", label: "Other", emoji: "\u{1F381}" },
];

export default function NewEventPage() {
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (!selectedType) {
      toast.error("Please select an event type");
      return;
    }
    formData.set("type", selectedType);
    setLoading(true);
    try {
      await createEvent(formData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create event");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Create Event</h1>
        <p className="text-muted-foreground">
          Set up a gift registry for your occasion
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label>What&apos;s the occasion?</Label>
          <div className="grid grid-cols-3 gap-2">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm transition-all ${
                  selectedType === type.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="text-2xl">{type.emoji}</span>
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedType === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customTypeName">Custom event type</Label>
            <Input
              id="customTypeName"
              name="customTypeName"
              placeholder="e.g., Graduation Party"
              maxLength={50}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Event title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Rahul's 30th Birthday"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell your guests a bit about the event..."
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">
            Event date <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="eventDate" name="eventDate" type="date" />
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl"
          size="lg"
          disabled={loading || !selectedType}
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
}
