import React from "react";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen">
      {/* <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <Header />
        <div className="main-content">{children}</div>
      </section> */}

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>

      <Toaster />
    </main>
  );
};
export default Layout;
