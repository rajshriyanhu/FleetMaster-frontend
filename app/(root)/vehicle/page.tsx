'use client'

import React from "react";
import AllVehicleTable from "@/components/AllVehicleTable";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const VehiclePage = () => {
  const router = useRouter();
  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          View and Manage your Vehicles
        </p>
        <Button
          onClick={() => {
            router.push('/vehicle/upload')
          }}
          className="rounded-full"
        >
          <PlusCircledIcon className="text-xl font-semibold" />
          New Vehicle
        </Button>
      </div>
      <AllVehicleTable />
    </div>
  );
};

export default VehiclePage;
