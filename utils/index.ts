import { TripStatus } from "@/dto";

export function convertTimestampToDate(timestamp: string): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

export const getTripStatus = (status : TripStatus) => {
  if(status === 'NOT_STARTED')return 'Not Started';
  if(status === 'IN_PROGRESS')return 'In progress';
  if(status === 'CANCELLED')return 'Cancelled';
  if(status === 'EXPIRED')return 'Expired';
  if(status === 'COMPLETED')return 'Completed';
}