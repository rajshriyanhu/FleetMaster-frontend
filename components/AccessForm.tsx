"use client";

import { User } from "@/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useUpdateAccess } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  vehicleRead: z.boolean(),
  vehicleWrite: z.boolean(),
  tripRead: z.boolean(),
  tripWrite: z.boolean(),
});

const AccessForm = ({ user, setIsModalOpen }: { user: User; setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; }) => {
    const {mutateAsync: updateAccess} = useUpdateAccess();
    const {toast} = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleRead: user.permissions.vehicle.read,
      vehicleWrite: user.permissions.vehicle.write,
      tripRead: user.permissions.trip.read,
      tripWrite: user.permissions.trip.write,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    updateAccess({
        userId: user.id,
        permissions: {
            trip: {
                read: values.vehicleRead,
                write: values.vehicleWrite
            },
            vehicle: {
                read: values.tripRead,
                write: values.tripWrite
            }
        } 
    })
    .then((res) => {
        console.log(res)
        toast({
            title: 'User permission updated successfully!'
        })
        setIsModalOpen(false)
    })
    .catch((err) => {
        toast({
            title: 'Something went wrong!',
            description: err.message,
            variant: 'destructive'
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="text-lg font-semibold">Vehicle Access</div>
        <div className="flex gap-4 items-center mb-4">
          <FormField
            control={form.control}
            name="vehicleRead"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="shad-form-label">
                    Can see vehicles
                  </FormLabel>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleWrite"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="shad-form-label">
                    Can add vehicles
                  </FormLabel>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
        </div>

        <div className="text-lg font-semibold">Trip Access</div>
        <div className="flex gap-4 items-center mb-4">
          <FormField
            control={form.control}
            name="tripRead"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="shad-form-label">
                    Can see trips
                  </FormLabel>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tripWrite"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="shad-form-label">
                    Can add trips
                  </FormLabel>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full rounded-lg" type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AccessForm;
