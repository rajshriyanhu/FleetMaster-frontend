"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser } from "@/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const user = getStoredUser();
  const router = useRouter();
  const getActiveClass = (url: string) => {
    const cleanPathname = pathname.split("?")[0];
    const cleanUrl = url.split("?")[0];
    if (cleanUrl === "/") return cleanUrl === cleanPathname;
    return cleanPathname.includes(cleanUrl);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center gap-4">
                  <Image
                    src="/fleetmaster-logo.png"
                    alt="logo"
                    width={40}
                    height={40}
                    className="h-auto rounded-md"
                  />
                  <div className="text-xl font-bold text-brand">
                    FleetMaster
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              if (user && user.role !== "ADMIN" && item.name === "All Users") {
                return null;
              }
              if (user && user.role !== "ADMIN" && item.name === "All Invites") {
                return null;
              }
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className="py-6"
                    isActive={getActiveClass(item.url)}
                  >
                    <Link
                      href={item.url}
                      className="font-medium flex items-center gap-3 text-base"
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter onClick={() => router.push('/profile')}>
        {user && (
          <div className="flex items-center gap-3 p-4 border-t border-gray-100 cursor-pointer">
            <div className="flex-shrink-0">
              <Image
                src="data:image/png;base64,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"
                alt={`${user.name}'s avatar`}
                width={40}
                height={40}
                className="rounded-full border border-gray-200"
              />
            </div>
            <div className="hidden lg:flex flex-col min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
