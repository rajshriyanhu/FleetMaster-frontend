"use client";

import { useGetLoggedInUser } from "@/hooks/use-auth-hook";
import { getStoredUser, setStoredUser } from "@/utils";
import { useEffect } from "react";

const UserInitializer = () => {
  const { data: user } = useGetLoggedInUser();
  const storedUser = getStoredUser();

  useEffect(() => {
    if (user && storedUser && user.role !== storedUser.role) {
      setStoredUser(user);
    }
  }, [user, storedUser]);

  return null;
};

export default UserInitializer;
