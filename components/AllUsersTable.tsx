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
import { convertTimestampToDate, getTripStatus } from "@/utils";
import { Trip, User } from "@/dto";
import { useRouter } from "next/navigation";
import { useGetAllTrips } from "@/hooks/use-trip-hook";
import { useGetAllUsers } from "@/hooks/use-auth-hook";
import { UserAccessModal } from "./UserAccessModal";

const AllUsersTable = () => {
  const router = useRouter();
  const { data: userList, isLoading } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(userList);

  if (isLoading || !userList) return <>Loading</>

  return (
    <>
      <Table>
        <TableCaption>A list of all your users</TableCaption>
        <TableHeader className="bg-white py-4">
          <TableRow>
            <TableHead className="font-semibold text-black">No.</TableHead>
            <TableHead className="font-semibold text-black">Name</TableHead>
            <TableHead className="font-semibold text-black">Email</TableHead>
            <TableHead className="font-semibold text-black">Role</TableHead>
            <TableHead className="font-semibold text-black">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {userList.map((user: User, index: number) => {
            return (
              <TableRow className="h-16 cursor-pointer" key={user.id} onClick={() => {
                setSelectedUser(user);
                setIsModalOpen(true);
              }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{convertTimestampToDate(user.createdAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>

      </Table>
      <UserAccessModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} user={selectedUser} />
    </>
  );
};

export default AllUsersTable;
