"use client";

import { User } from "@/dto";
import { getStoredUser } from "@/utils";
import { Role } from "@/utils/permissions";
import { useEffect, useState } from "react";

export const useUserRole = (): Role | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);
  if (!user) return null;

  try {
    return user.role as Role;
  } catch (e) {
    console.log("Invalid user in localStorage:", e);
    return null;
  }
};
