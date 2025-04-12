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
import { Button } from "./ui/button";
import { useUpdateAccess } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR", "VIEWER", "CREATOR"]),
});

const AccessForm = ({
  user,
  setIsModalOpen,
}: {
  user: User;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutateAsync: updateAccess } = useUpdateAccess();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: user.role,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    updateAccess({
      userId: user.id,
      role: values.role,
    })
      .then((res) => {
        console.log(res);
        toast({
          title: "User permission updated successfully!",
        });
        setIsModalOpen(false);
      })
      .catch((err) => {
        toast({
          title: "Something went wrong!",
          description: err.message,
          variant: "destructive",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="CREATOR">Creator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full rounded-lg" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccessForm;
