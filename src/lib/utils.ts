import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateNextId(currentId: string): string {
  return currentId.replace(/\d+$/, (match) => {
    const number = parseInt(match, 10);

    const nextNumber = number + 1;

    return nextNumber.toString().padStart(match.length, "0");
  });
}