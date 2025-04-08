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
import { Trip } from "@/dto";
import { useRouter } from "next/navigation";
import { SkeletonTable } from "./skeleton-table";

const AllTripTable = ({
  trips,
  isLoading,
}: {
  trips: Trip[] | null;
  isLoading: boolean;
}) => {
  const router = useRouter();

  if (isLoading) return <SkeletonTable />

  if (!trips) return <>Error</>;

  return (
    <Table>
      <TableCaption>A list of all your trips</TableCaption>
      <TableHeader className="bg-white py-4">
        <TableRow>
          <TableHead className="font-semibold text-black">No.</TableHead>
          <TableHead className="font-semibold text-black">Source</TableHead>
          <TableHead className="font-semibold text-black">
            Destination
          </TableHead>
          <TableHead className="font-semibold text-black">Price</TableHead>
          <TableHead className="font-semibold text-black">Customer</TableHead>
          <TableHead className="font-semibold text-black">Driver</TableHead>
          <TableHead className="font-semibold text-black">Start Date</TableHead>
          <TableHead className="font-semibold text-black">End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip: Trip, index: number) => {
          return (
            <TableRow
              className="h-16 cursor-pointer"
              key={trip.id}
              onClick={() => router.push(`/trip/${trip.id}`)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{trip.start_location}</TableCell>
              <TableCell>{trip.end_location}</TableCell>
              <TableCell>{trip.profit}</TableCell>
              <TableCell>{trip.customer.name}</TableCell>
              <TableCell>{trip.driver.name}</TableCell>
              <TableCell>{convertTimestampToDate(trip.start_date)}</TableCell>
              <TableCell>{convertTimestampToDate(trip.end_date)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AllTripTable;
