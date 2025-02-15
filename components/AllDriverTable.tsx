import { useRouter } from "next/navigation";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Driver } from "@/dto";
import { convertTimestampToDate } from "@/utils";

const AllDriverTable = ({
  drivers,
  isLoading,
}: {
  drivers: Driver[] | null;
  isLoading: boolean;
}) => {
  const router = useRouter();

  if (isLoading || !drivers) return <>Loading</>;

  return (
    <Table>
      <TableCaption>A list of all your drivers</TableCaption>
      <TableHeader className="bg-white py-4">
        <TableRow>
          <TableHead className="font-semibold text-black">No.</TableHead>
          <TableHead className="font-semibold text-black">Name</TableHead>
          <TableHead className="font-semibold text-black">Email</TableHead>
          <TableHead className="font-semibold text-black">
            Phone Number
          </TableHead>
          <TableHead className="font-semibold text-black">State</TableHead>
          <TableHead className="font-semibold text-black">
            Working State
          </TableHead>
          <TableHead className="font-semibold text-black">
            Joining Date
          </TableHead>
          <TableHead className="font-semibold text-black">
            Employment Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drivers.map((driver: Driver, index: number) => {
          return (
            <TableRow
              className="h-16 cursor-pointer"
              key={driver.id}
              onClick={() => router.push(`/drivers/${driver.id}`)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell>{driver.phone_number}</TableCell>
              <TableCell>{driver.address.state}</TableCell>
              <TableCell>{driver.working_state}</TableCell>
              <TableCell>
                {convertTimestampToDate(driver.joining_date)}
              </TableCell>
              <TableCell>{driver.employment_status}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AllDriverTable;
