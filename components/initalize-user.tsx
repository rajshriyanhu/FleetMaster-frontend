"use client";

import { User } from "@/dto";
import { useGetLoggedInUser } from "@/hooks/use-auth-hook";
import { getStoredUser } from "@/utils";
import { useEffect, useState } from "react";

const UserInitializer = () => {
  const { data: user } = useGetLoggedInUser();
  const [storedUser, setStoredUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setStoredUser(storedUser);
  }, []);


  useEffect(() => {
    if (user && storedUser && user.role !== storedUser.role) {
      setStoredUser(user);
    }
  }, [user, storedUser]);

  return null;
};

export default UserInitializer;
