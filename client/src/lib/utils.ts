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
  // Fixed competition end date: August 26, 2025
  return new Date(2025, 7, 26, 23, 59, 59); // August 26, 2025 11:59:59 PM
}

export function getPrizeForRank(rank: number): number {
  const prizes = [400, 200, 150, 100, 50, 40, 20, 20, 10, 10];
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
