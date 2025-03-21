"use client";

import { useGetAllVehicles } from "@/hooks/use-vehicle-hook";
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
import { Vehicle } from "@/dto";
import { useRouter } from "next/navigation";

const AllVehicleTable = ({
  vehicles,
  isLoading,
} : {
  vehicles: Vehicle[] | null;
  isLoading: boolean;
}) => {
  const router = useRouter();

  if (isLoading) return <>Loading</>

  if (!vehicles) {
    return <>
      <h2>Vehicles not fetched!</h2>
    </>
  }

  return (
    <Table>
      <TableCaption>A list of all your vehicles</TableCaption>
      <TableHeader className="bg-white py-4">
        <TableRow>
          <TableHead className="font-semibold text-black">No.</TableHead>
          <TableHead className="font-semibold text-black">Model</TableHead>
          <TableHead className="font-semibold text-black">Registration No.</TableHead>
          <TableHead className="font-semibold text-black">Region</TableHead>
          <TableHead className="font-semibold text-black">State</TableHead>
          <TableHead className="font-semibold text-black">Next Service</TableHead>
          <TableHead className="font-semibold text-black">Insurance</TableHead>
          <TableHead className="font-semibold text-black">PUC</TableHead>
          <TableHead className="font-semibold text-black">Fitness</TableHead>
          <TableHead className="font-semibold text-black">RC</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {vehicles.map((vehicle: Vehicle, index: number) => {
          return (
            <TableRow className="cursor-pointer h-16" key={vehicle.id} onClick={() => router.push(`/vehicle/${vehicle.id}`)}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.registration_no}</TableCell>
              <TableCell>{vehicle.region}</TableCell>
              <TableCell>{vehicle.state}</TableCell>
              <TableCell>{convertTimestampToDate(vehicle.next_service_due)}</TableCell>
              <TableCell>{convertTimestampToDate(vehicle.insurance_validity)}</TableCell>
              <TableCell>{convertTimestampToDate(vehicle.puc_validity)}</TableCell>
              <TableCell>{convertTimestampToDate(vehicle.fitness_validity)}</TableCell>
              <TableCell>{convertTimestampToDate(vehicle.registration_date)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AllVehicleTable;
