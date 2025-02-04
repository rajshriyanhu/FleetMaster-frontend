"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Bell, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import UserContext from "@/context/user-context";
import { useLogout } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const router = useRouter();
  const {toast} = useToast();
  const {mutateAsync: logout} = useLogout();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext is not available!");
  }

  const { user, setUser } = context;

  const handleLogout = () => {
    logout()
    .then((res) => {
      setUser(undefined)
      toast({
        title: 'Logout successful'
      })
      router.push('/sign-in')
    })
    .catch((err) => {
      toast({
        title: 'Failed to logout.',
        description: 'Please try again later!',
        variant: 'destructive'
      })
    })
  }
  return (
    <header className="header">
      <div className="header-wrapper">
        <Bell />
        {user ? <Button onClick={handleLogout}>
          Sign Out <LogOut size={24} />
        </Button> : <Button
          onClick={() => {
            router.push("/sign-in");
          }}
        >
          Sign In <LogIn size={24} />
        </Button>}
      </div>
    </header>
  );
};
export default Header;
