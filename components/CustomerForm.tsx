"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { Customer } from "@/dto";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/use-customer-hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IndianStates } from "@/constants";
import { useRouter } from "next/navigation";

const customerFormSchema = () => {
  return z.object({
    prefix: z.string(),
    name: z.string().min(1, "Expense name is required"),
    email: z.string().email().optional(),
    phone_number: z.string().min(1, "Expense type is required"),
    street: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City name is required"),
    state: z.string().min(1, "Statee is required"),
    postal_code: z.number(),
  });
};

export type CustomerFormType = z.infer<ReturnType<typeof customerFormSchema>>;

const CustomerForm = ({ user }: { user?: Customer }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: createCustomer, isPending } = useCreateCustomer();
  const { mutateAsync: updateCustomer, isPending: isUpdatingCustomer } =
    useUpdateCustomer();
  const form = useForm<CustomerFormType>({
    resolver: zodResolver(customerFormSchema()),
    defaultValues: {
      prefix: "",
      name: "",
      email: "",
      phone_number: "",
      street: "",
      city: "",
      state: "",
      postal_code: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
      form.setValue("phone_number", user.phone_number);
      form.setValue("street", user.address.street);
      form.setValue("city", user.address.city);
      form.setValue("state", user.address.state);
    }
  }, [user, form]);

  const onSubmit = (data: CustomerFormType) => {
    if (user) {
      updateCustomer({ id: user.id, values: data })
        .then(() => {
          toast({
            title: "Customer details saved successfully",
          });
          form.reset();
          router.push("/customers?page=1&limit=10");
        })
        .catch((err) => {
          toast({
            title: "Uh Oh! Something went wrong",
            description: `Failed to update customer details, ${err.message}`,
            variant: "destructive",
          });
        });
      return;
    }
    createCustomer(data)
      .then(() => {
        toast({
          title: "Customer added successfully",
        });
        form.reset();
        router.push("/customers?page=1&limit=10");
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to create customer, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  const postalCode = form.watch("postal_code");
  const phone = form.watch("phone_number");

  useEffect(() => {
    if (postalCode !== undefined && postalCode !== null) {
      if (postalCode < 100000 || postalCode > 999999) {
        form.setError("postal_code", {
          type: "manual",
          message: "Postal code must be exactly 6 digits.",
        });
      } else {
        form.clearErrors("postal_code");
      }
    }

    if (phone) {
      if (phone.length > 0 && (phone.length !== 10 || !/^\d+$/.test(phone))) {
        form.setError("phone_number", {
          type: "manual",
          message: "Phone number must be exactly 10 digits.",
        });
      } else {
        form.clearErrors("phone_number");
      }
    }
  }, [postalCode, phone, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full px-8">
        {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <FormField
                name="prefix"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Address Details</h3>
          <div className="grid gap-6">
            <FormField
              name="street"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Flat no., Building name, Street"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {IndianStates.map((state, index) => (
                          <SelectItem key={index} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="postal_code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="6-digit PIN code"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="min-w-[120px]"
            disabled={isPending || isUpdatingCustomer}
          >
            {isPending || isUpdatingCustomer ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {user ? "Saving..." : "Creating..."}
              </div>
            ) : user ? (
              "Save Changes"
            ) : (
              "Create Customer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
