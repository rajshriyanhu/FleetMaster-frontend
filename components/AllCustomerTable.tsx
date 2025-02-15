import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Customer } from "@/dto";
import CustomerDetailsDialog from "./CustomerDetailsDialog";

const AllCustomerTable = ({
  customers,
  isLoading,
  searchQuery,
  sortBy,
}: {
  customers: Customer[] | null,
  isLoading: boolean,
  searchQuery: string;
  sortBy: string;
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  if (isLoading || !customers) return <>Loading</>;


  let filteredCustomers = customers;

  // Apply search filter
  if (searchQuery) {
    filteredCustomers = filteredCustomers.filter(
      (customer: Customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  filteredCustomers.sort((a: Customer, b: Customer) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "email":
        return a.email.localeCompare(b.email);
      case "city":
        return a.address.city.localeCompare(b.address.city);
      case "state":
        return a.address.state.localeCompare(b.address.state);
      case "created":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return 0;
    }
  });
  return (
    <>
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
            <TableHead className="font-semibold text-black">Address</TableHead>
            <TableHead className="font-semibold text-black">City</TableHead>
            <TableHead className="font-semibold text-black">State</TableHead>
            <TableHead className="font-semibold text-black">
              Postal Code
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer: Customer, index: number) => {
            return (
              <TableRow
                className="h-16 cursor-pointer"
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
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

      <CustomerDetailsDialog
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  );
};

export default AllCustomerTable;
