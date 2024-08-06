import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSku(productId: number): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${randomPart}${productId.toString().padStart(6, '0')}`;
}