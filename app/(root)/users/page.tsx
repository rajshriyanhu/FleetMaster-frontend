"use client";

import AllUsersTable from "@/components/AllUsersTable";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useHeader } from "@/hooks/use-header";
import { UserInviteModal } from "@/components/user-invite-modal";

const UsersPage = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>All Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);
  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          Manage users' permission
        </p>
        <UserInviteModal />
      </div>

      <AllUsersTable />
    </div>
  );
};

export default UsersPage;
