"use client";

import AllCustomerTable from "@/components/AllCustomerTable";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React from "react";

const ConsumerPage = () => {
  const router = useRouter();

  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          View and manage your customers
        </p>
        <Button
          onClick={() => {
            router.push("/customers/create");
          }}
          className="rounded-full"
        >
          <PlusCircledIcon className="text-xl font-semibold" />
          New Customer
        </Button>
      </div>

      <AllCustomerTable />
    </div>
  );
};

export default ConsumerPage;
