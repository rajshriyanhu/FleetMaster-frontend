"use client";

import { User } from "@/dto";

export function convertTimestampToDate(timestamp: string): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUser = (user: User) => {
  if (typeof window === "undefined") return null;
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearStoredUser = () => {
  if (typeof window === "undefined") return null;
  localStorage.removeItem("user");
};
