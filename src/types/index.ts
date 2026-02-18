import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export type EventType =
  | "birthday"
  | "wedding"
  | "housewarming"
  | "baby_shower"
  | "anniversary"
  | "custom";

export type GiftStatus = "available" | "claimed";

export type SuggestionStatus = "pending" | "approved" | "ignored";

export type NotificationType = "claim" | "suggestion";
