"use client";

import VehicleForm from "@/components/VehicleForm";
import { useHeader } from "@/hooks/use-header";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const UploadVehiclePage = () => {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/vehicle">
            <BreadcrumbItem>Vehicles</BreadcrumbItem>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add new vehicle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter your vehicle details
      </h2>
      <VehicleForm />
    </div>
  );
};

export default UploadVehiclePage;
