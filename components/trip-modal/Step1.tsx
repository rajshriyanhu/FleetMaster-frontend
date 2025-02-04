'use client';

import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { tripFormType } from "./TripModal";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetAllCustomers } from "@/hooks/use-customer-hook";
import { Customer } from "@/dto";

const Step1 = ({
  form,
  setModalStep,
  setIsModalOpen,
}: {
  form: UseFormReturn<tripFormType>;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data, isError } = useGetAllCustomers();
  return (
    <DialogContent className="w-full">
      <DialogHeader className="flex flex-col gap-3">
        <DialogTitle className="text-light-100 text-center">
          Select Customer
        </DialogTitle>
      </DialogHeader>
      {data && !isError && (
        <FormField
          name="customer_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a customer</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.customers.map((customer: Customer) => {
                      return (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <DialogFooter className="flex gap-2">
        <Button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="modal-cancel-button"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            setModalStep(2);
          }}
          className="modal-submit-button"
        >
          Next
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default Step1;
