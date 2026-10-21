import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }

  const currencyMap: Record<Currency, { locale: string; code: string; symbol: string }> = {
    INR: { locale: 'en-IN', code: 'INR', symbol: '₹' },
    USD: { locale: 'en-US', code: 'USD', symbol: '$' },
    EUR: { locale: 'de-DE', code: 'EUR', symbol: '€' },
    GBP: { locale: 'en-GB', code: 'GBP', symbol: '£' },
    AED: { locale: 'ar-AE', code: 'AED', symbol: 'AED ' },
  };

  const config = currencyMap[currency] || currencyMap.INR;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function calculateDaysRemaining(targetDate: string): number {
  if (!targetDate) return 0;
  const target = new Date(targetDate).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
