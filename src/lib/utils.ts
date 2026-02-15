import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Increments the last found number in a string while preserving formatting.
 * Examples:
 * "001" -> "002"
 * "INV-2025-099" -> "INV-2025-100"
 * "QT/24/05" -> "QT/24/06"
 */
export const incrementInvoiceNumber = (lastNumber: string | undefined | null): string => {
  // 1. Handle empty/undefined input
  if (!lastNumber) return "n111" ;

  // 2. Use RegExp.exec() instead of string.match() to satisfy ESLint
  // Captures: Group 1 (Prefix), Group 2 (The Number)
  const regex = /^(.*?)(\d+)$/;
  const match = regex.exec(lastNumber);

  if (match) {
    const prefix = match[1] ?? "";
    const numberPart = match[2];

    if (numberPart) {
      // Increment
      const nextNumber = parseInt(numberPart, 10) + 1;

      // Pad with zeros to match original length
      const paddedNumber = nextNumber.toString();

      return `${prefix}${paddedNumber}`;
    }
  }

  // 3. Fallback: If no number is found (e.g. "Draft"), append "-1"
  return `${lastNumber}-1`;
};