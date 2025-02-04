import { createContext } from "react";
import { User } from "@/dto";

interface UserContextType {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;