import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const updateEndDate = (startDate: Date | undefined, packageType: string): string | null => {
  if (!startDate || !packageType) return null;

  const durationMap: Record<string, number> = {
    "06 Hrs or 60 Kms": 6,
    "12 Hrs or 150 Kms": 12,
    "24 Hrs or 300 Kms": 24,
  };

  const durationHours = durationMap[packageType];

  if (!durationHours) return null;

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + durationHours);

  return format(endDate, "PPP HH:mm:ss");
};

export function getDaysBetweenDates(date1: Date, date2: Date): number {
  const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const diffInMilliseconds = utcDate2 - utcDate1;

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.round(diffInMilliseconds / millisecondsPerDay);
}
