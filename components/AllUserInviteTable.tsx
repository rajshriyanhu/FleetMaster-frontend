"use client";

import React from "react";
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
import { Invite } from "@/dto";
import { useGetAllInvites } from "@/hooks/use-invite-user-hook";
import { Button } from "./ui/button";
import { SkeletonTable } from "./skeleton-table";
import { Error } from "./error";

const AllUserInviteTable = () => {
  const { data: inviteList, isLoading, isError } = useGetAllInvites();

  if (isLoading) return <SkeletonTable />;

  if(isError)return <Error />

  return (
    <>
      <Table>
        <TableCaption>
          Invites older than 7 days are automatically deleted
        </TableCaption>
        <TableHeader className="bg-white py-4">
          <TableRow>
            <TableHead className="font-semibold text-black">No.</TableHead>
            <TableHead className="font-semibold text-black">Name</TableHead>
            <TableHead className="font-semibold text-black">Email</TableHead>
            <TableHead className="font-semibold text-black">Role</TableHead>
            <TableHead className="font-semibold text-black">Status</TableHead>
            <TableHead className="font-semibold text-black">Sent At</TableHead>
            <TableHead className="font-semibold text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inviteList.invites.map((invite: Invite, index: number) => {
            const isActive =
              new Date().getTime() - new Date(invite.created_at).getTime() <
              24 * 60 * 60 * 1000;

            return (
              <TableRow className="h-16" key={invite.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{invite.name}</TableCell>
                <TableCell>{invite.email}</TableCell>
                <TableCell>{invite.role}</TableCell>
                <TableCell>
                  {isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Expired</span>
                  )}
                </TableCell>
                <TableCell>
                  {convertTimestampToDate(invite.created_at)}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" disabled={!isActive}>
                    Resend
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default AllUserInviteTable;
