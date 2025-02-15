'use client'

import React, { useEffect } from "react";
import AllVehicleTable from "@/components/AllVehicleTable";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useHeader } from "@/hooks/use-header";

const VehiclePage = () => {
  const router = useRouter();
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Vehicles view and manage your vehicles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);
  
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
