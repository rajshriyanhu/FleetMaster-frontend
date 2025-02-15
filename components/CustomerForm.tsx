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
import Image from "next/image";
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
import { indianStates } from "@/constants";
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
      prefix: '',
      name: '',
      email: '',
      phone_number: '',
      street: '',
      city: '',
      state: '',
      postal_code: undefined
    }
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
          router.push('/customers?page=1&limit=10')
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
          router.push('/customers?page=1&limit=10')
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to create customer, ${err.message}`,
          variant: "destructive",
        });
      });
    form.reset();
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 w-full"
      >
        <div className="flex gap-4 w-full">
          <FormField
            name="prefix"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-2/5">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Prefix</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder="Prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="shad-form-message" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Name of the customer
                  </FormLabel>
                  <FormControl>
                    <Input className="shad-input" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          name="phone_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Phone Number</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          name="street"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Flat/Builidng/Street Name
                </FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">City</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">State</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={vehicle ? vehicle.state : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianStates.map((state, index) => {
                        return (
                          <SelectItem key={index} value={state}>
                            {state}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="postal_code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">PIN Code</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <Button className="modal-submit-button">
          Submit
          {(isPending || isUpdatingCustomer) && (
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              height={24}
              width={24}
              className="ml-2 animate-spin"
            />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CustomerForm;
