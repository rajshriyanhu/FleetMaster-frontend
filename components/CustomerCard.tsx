import { Customer } from "@/dto";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import CustomerModal from "./CustomerForm";
import { useDeleteCustomer } from "@/hooks/use-customer-hook";
import { useToast } from "@/hooks/use-toast";

const CustomerCard = ({ customer }: { customer: Customer }) => {
  const{toast} = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();

  return (
    <>
      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription>
            {customer.address.city}, {customer.address.state}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <p className=" text-slate-600">Email:</p>
              <p className="font-semibold">{customer.email}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-slate-600">Phone:</p>
              <p className="font-semibold">{customer.phone_number}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={() => setIsModalOpen(true)} variant="secondary">
            Edit
          </Button>
          <Button
            onClick={() => {deleteCustomer(customer.id)
              .then(() => {
                toast({
                  title: 'Customer deleted successfully!'
                })
                
              })
              .catch((err) => {
                toast({
                  title: 'Uh Oh! Something went wrong',
                  description: `Failed to delete customer, ${err.message}`,
                  variant: 'destructive'
                })
              })
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
      <CustomerModal
        user={customer}
        type="edit"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default CustomerCard;
