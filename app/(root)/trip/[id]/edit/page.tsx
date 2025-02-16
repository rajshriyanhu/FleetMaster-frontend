"use client";

import TripForm from "@/components/TripForm";
import { Trip } from "@/dto";
import { useHeader } from "@/hooks/use-header";
import { useGetTripById } from "@/hooks/use-trip-hook";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TripEditPage() {
  const params = useParams();
  const { data, isLoading, isError } = useGetTripById(params.id as string);
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/trip">Trip</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/trip/${params.id as string}`}>
            Trip details
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  if (isLoading) return <>Loading</>;

  if (isError) return <>Something wnet wrong</>;

  const trip: Trip = data.trip;
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Edit your trip details
      </h2>
      <TripForm trip={trip} />
    </div>
  );
}
