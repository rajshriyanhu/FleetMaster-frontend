import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const updateEndDate = (startDate: Date | undefined, packageType: string): string | null => {
  if (!startDate || !packageType) return null;

  // Parse the package type to extract duration
  const durationMap: Record<string, number> = {
    "06 Hrs or 60 Kms": 6,
    "12 Hrs or 150 Kms": 12,
    "24 Hrs or 300 Kms": 24,
  };

  const durationHours = durationMap[packageType];

  if (!durationHours) return null;

  // Calculate the end date
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  return format(endDate, "PPP HH:mm:ss");
};

export function getDaysBetweenDates(date1: Date, date2: Date): number {
  // Convert both dates to UTC to avoid timezone issues
  const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // Calculate the difference in milliseconds
  const diffInMilliseconds = utcDate2 - utcDate1;

  // Convert milliseconds to days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.round(diffInMilliseconds / millisecondsPerDay);
}

// Example usage:
const date1 = new Date('2025-01-01');
const date2 = new Date('2025-01-08');

console.log(getDaysBetweenDates(date1, date2)); // Output: 7