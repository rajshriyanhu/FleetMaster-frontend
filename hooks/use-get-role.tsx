import { getStoredUser } from "@/utils";
import { Role } from "@/utils/permissions";

export const useUserRole = (): Role | null => {
  const user = getStoredUser();
  console.log(user);
  if (!user) return null;

  try {
    return user.role as Role;
  } catch (e) {
    console.log("Invalid user in localStorage:", e);
    return null;
  }
};