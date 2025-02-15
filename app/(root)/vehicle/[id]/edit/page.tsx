'use client'

import VehicleForm from "@/components/VehicleForm";
import { Vehicle } from "@/dto";
import { useGetVehicleById } from "@/hooks/use-vehicle-hook";
import { useParams } from "next/navigation";
import { useHeader } from "@/hooks/use-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect } from "react";

export default function EditPage() {
    const params = useParams();
    const { data, isLoading, isError } = useGetVehicleById(params.id as string);
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
            <BreadcrumbPage>Edit vehicle details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

    
    if (isLoading) return <>Loading</>;
    
    if (isError) return <>Something wnet wrong</>;
    
    const vehicle: Vehicle = data.vehicle;
    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <h2 className="h2 text-brand text-2xl font-semibold">
                Edit your vehicle details
            </h2>
            <VehicleForm vehicle={vehicle} />
        </div>
    )
}