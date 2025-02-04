"use client";

import TripForm from "@/components/TripForm";
import { Trip } from "@/dto";
import { useGetTripById } from "@/hooks/use-trip-hook";
import { useGetVehicleById } from "@/hooks/use-vehicle-hook";
import { useParams } from "next/navigation";

export default function TripEditPage() {
  const params = useParams();
  const { data, isLoading, isError } = useGetTripById(params.id as string);

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
