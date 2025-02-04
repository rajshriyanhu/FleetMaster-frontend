import { useGetAllDrivers } from "@/hooks/use-driver-hook";
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
import { Customer, Driver } from "@/dto";
import { convertTimestampToDate } from "@/utils";
import { useGetAllCustomers } from "@/hooks/use-customer-hook";

const AllCustomerTable = () => {
  const router = useRouter();
  const { data, isLoading } = useGetAllCustomers();

  console.log(data);

  if (isLoading || !data) return <>Loading</>;

  const customers = data.customers;

  console.log(customers)

  return (
    <Table>
      <TableCaption>A list of all your customers</TableCaption>
      <TableHeader className="bg-white py-4">
        <TableRow>
          <TableHead className="font-semibold text-black">No.</TableHead>
          <TableHead className="font-semibold text-black">Name</TableHead>
          <TableHead className="font-semibold text-black">Email</TableHead>
          <TableHead className="font-semibold text-black">
            Phone Number
          </TableHead>
          <TableHead className="font-semibold text-black">
            Address
          </TableHead>
          <TableHead className="font-semibold text-black">
            City
          </TableHead>
          <TableHead className="font-semibold text-black">State</TableHead>
          <TableHead className="font-semibold text-black">
            Postal Code
          </TableHead>
          {/* <TableHead className="font-semibold text-black">
            Employment Status
          </TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer: Customer, index: number) => {
          return (
            <TableRow
              className="h-16 cursor-pointer"
              key={customer.id}
              // onClick={() => router.push(`/customer/${customer.id}`)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone_number}</TableCell>
              <TableCell>{customer.address.street}</TableCell>
              <TableCell>{customer.address.city}</TableCell>
              <TableCell>{customer.address.state}</TableCell>
              <TableCell>{customer.address.postal_code}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AllCustomerTable;
