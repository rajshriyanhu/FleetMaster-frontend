"use client";

import AllDriverTable from "@/components/AllDriverTable";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React from "react";

const DriverPage = () => {
  const router = useRouter();

  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          View and manage your drivers
        </p>
        <Button
          onClick={() => {
            router.push("/drivers/create");
          }}
          className="rounded-full"
        >
          <PlusCircledIcon className="text-xl font-semibold" />
          New Driver
        </Button>
      </div>

      <AllDriverTable />
    </div>
  );
};

export default DriverPage;
