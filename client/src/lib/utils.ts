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
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  if (now.getDate() < 25) {
    return new Date(currentYear, currentMonth, 25, 0, 0, 0);
  } else {
    return new Date(currentYear, currentMonth + 1, 25, 0, 0, 0);
  }
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
