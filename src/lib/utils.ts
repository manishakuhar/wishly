import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(paisa: number): string {
  const rupees = paisa / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function generateShareUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/e/${slug}`;
}

export function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    birthday: "Birthday",
    wedding: "Wedding",
    housewarming: "Housewarming",
    baby_shower: "Baby Shower",
    anniversary: "Anniversary",
    custom: "Custom",
  };
  return labels[type] || type;
}

export function getEventTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    birthday: "\u{1F382}",
    wedding: "\u{1F492}",
    housewarming: "\u{1F3E0}",
    baby_shower: "\u{1F476}",
    anniversary: "\u{1F496}",
    custom: "\u{1F381}",
  };
  return emojis[type] || "\u{1F381}";
}
