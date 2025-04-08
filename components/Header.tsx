"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { useHeader } from "@/hooks/use-header";
import { clearStoredUser, getStoredUser } from "@/utils";

const Header = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: logoutFn } = useLogout();
  const { title } = useHeader();
  const user = getStoredUser();
  const handleLogout = () => {
    logoutFn()
      .then((res) => {
        toast({
          title: "Logout successful",
        });
        clearStoredUser();
        router.push("/sign-in");
      })
      .catch((err) => {
        toast({
          title: "Failed to logout.",
          description: "Please try again later!",
          variant: "destructive",
        });
      });
  };
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b pr-4 justify-between">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {title}
      </div>
      <div className="header-wrapper">
        { user ? (
          <Button onClick={handleLogout}>
            Sign Out <LogOut size={24} />
          </Button>
        ) : (
          <Button
            onClick={() => {
              router.push("/sign-in");
            }}
          >
            Sign In <LogIn size={24} />
          </Button>
        )}
      </div>
    </header>
  );
};
export default Header;
