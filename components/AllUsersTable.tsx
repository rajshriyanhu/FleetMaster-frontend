"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertTimestampToDate } from "@/utils";
import { User } from "@/dto";
import { useGetAllUsers } from "@/hooks/use-auth-hook";
import { UserAccessModal } from "./UserAccessModal";
import { SkeletonTable } from "./skeleton-table";
import { Error } from "./error";
import { Button } from "./ui/button";

const AllUsersTable = () => {
  const { data: userList, isLoading, isError } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <SkeletonTable />;

  if (isError) return <Error />;

  return (
    <>
            <Table>
        <TableCaption>A list of all your users</TableCaption>
        <TableHeader className="bg-white py-4">
          <TableRow>
            <TableHead className="w-[80px] font-semibold text-black">No.</TableHead>
            <TableHead className="w-[200px] font-semibold text-black">Name</TableHead>
            <TableHead className="w-[250px] font-semibold text-black">Email</TableHead>
            <TableHead className="w-[150px] font-semibold text-black">Role</TableHead>
            <TableHead className="w-[200px] font-semibold text-black">Joined On</TableHead>
            <TableHead className="w-[100px] font-semibold text-black"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user: User, index: number) => {
            return (
              <TableRow className="h-16" key={user.id}>
                <TableCell className="w-[80px]">{index + 1}</TableCell>
                <TableCell className="w-[200px]">{user.name}</TableCell>
                <TableCell className="w-[250px]">{user.email}</TableCell>
                <TableCell className="w-[150px]">{user.role}</TableCell>
                <TableCell className="w-[200px]">{convertTimestampToDate(user.createdAt)}</TableCell>
                <TableCell className="w-[100px] text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit Access
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <UserAccessModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        user={selectedUser}
      />
    </>
  );
};

export default AllUsersTable;
