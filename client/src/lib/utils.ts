import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getNextResetDate(): Date {
  // Fixed competition end date for April 2026
  return new Date(2026, 3, 30, 23, 59, 59); // April 30, 2026 11:59:59 PM
}

export function getPrizeForRank(rank: number): number {
  const prizes = [1500, 750, 250, 150, 100, 75, 50, 50, 50, 25];
  return prizes[rank - 1] || 0;
}

export function getRankSuffix(rank: number): string {
  const j = rank % 10;
  const k = rank % 100;
  
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}
