'use client';

import DriverForm from "@/components/DriverForm";
import { Error } from "@/components/error";
import { SkeletonCard } from "@/components/skeleton-card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Driver } from "@/dto";
import { useGetDriverById } from "@/hooks/use-driver-hook";
import { useHeader } from "@/hooks/use-header";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditDriverPage() {
    const params = useParams();
  const { data, isLoading, isError } = useGetDriverById(params.driverId as string);
    const { setTitle } = useHeader();
  
    useEffect(() => {
      setTitle(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/drivers">Driver</BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbLink href={`/drivers/${params.id as string}`}>
    Driver details
  </BreadcrumbLink>
  <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>


      );
    }, []);
  
    if (isLoading) return <div className="space-y-4 mx-2">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      </div>;
  
    if (isError) return <Error />
  
    const driver: Driver = data.driver;

    return (
      <div className="flex flex-col items-center justify-center space-y-8">
        <h2 className="h2 text-brand text-2xl font-semibold">
          Edit Driver details
        </h2>
        <DriverForm driver={driver} />
      </div>
    );
}
