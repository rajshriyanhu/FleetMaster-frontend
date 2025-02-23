"use client";

import { Separator } from "@/components/ui/separator";
import { Trip } from "@/dto";
import { useToast } from "@/hooks/use-toast";
import { useDeleteTrip, useGetTripById } from "@/hooks/use-trip-hook";
import { convertTimestampToDate } from "@/utils";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useHeader } from "@/hooks/use-header";
import { Button } from "@/components/ui/button";

const TripDetailsPage = () => {
  const params = useParams();
  const {toast} = useToast();
  const router = useRouter();
  const { data, isLoading, isError } = useGetTripById(params.id as string);
  const {mutateAsync: deleteTrip} = useDeleteTrip(params.id as string);
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/trip">Trip</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Trip details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  if (isLoading) return <>Loading</>;

  if (isError) return <>Something wnet wrong</>;

  const trip: Trip = data.trip;

  const handleDeleteTrip = async () => {
    await deleteTrip()
    .then(() => {
      router.push('/trip')  
      toast({
            title: 'Vehicle entry deleted successfully!',
        })
    })
    .catch((err) => {
        toast({
            title: 'Uh Oh! Something went wrong',
            description: `Failed to delete vehicle entry, ${err.message}`,
            variant: 'destructive'
        })
    })
  }

  const handleEditTrip = () => {
    router.push(`/trip/${trip.id}/edit`)
  }

  console.log(trip)

  return (
    <div className="flex-col justify-center space-y-8">
      <div className="flex w-full justify-between">
        <p className="text-brand text-3xl font-bold">Trip Details</p>
        <div className="flex items-center gap-3">
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleEditTrip}
          >
            <Pencil1Icon className="h-4 w-4" /> Edit
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDeleteTrip}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
        
      </div>
      <div className="flex w-2/3 mx-auto flex-col justify-center space-y-3 rounded-xl bg-white p-8">
      <div className="grid grid-cols-2 gap-4">
          <div>Trip Type</div>
          <div className="text-lg font-semibold">{trip.trip_type}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Vehicle</div>
          <div className="text-lg font-semibold">{trip.vehicle.registration_no}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Driver Name</div>
          <div className="text-lg font-semibold">{trip.driver.name}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Customer Name</div>
          <div className="text-lg font-semibold">{trip.customer.name}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Customer&apos;s Phone number</div>
          <div className="text-lg font-semibold">{trip.customer.phone_number}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Trip Start Date</div>
          <div className="text-lg font-semibold">
            {convertTimestampToDate(trip.start_date)}
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Trip End Date</div>
          <div className="text-lg font-semibold">
            {convertTimestampToDate(trip.end_date)}
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Number of Days</div>
          <div className="text-lg font-semibold">{trip.days}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Start Location</div>
          <div className="text-lg font-semibold">{trip.start_location}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>End Location</div>
          <div className="text-lg font-semibold">{trip.end_location}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Locations visited</div>
          <div className="text-lg font-semibold">{trip.location_visited}</div>
        </div>
        <Separator /><div className="grid grid-cols-2 gap-4">
          <div>Start KMs</div>
          <div className="text-lg font-semibold">{trip.start_km}</div>
        </div>
        <Separator /><div className="grid grid-cols-2 gap-4">
          <div>End KMs</div>
          <div className="text-lg font-semibold">{trip.end_km}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Total KMs run</div>
          <div className="text-lg font-semibold">{trip.total_km}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Total Fuel Cost</div>
          <div className="text-lg font-semibold">{trip.total_fuel_cost}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Vehicle Average</div>
          <div className="text-lg font-semibold">{trip.vehicle_average}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Total State Tax</div>
          <div className="text-lg font-semibold">{trip.state_tax}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Total Toll</div>
          <div className="text-lg font-semibold">{trip.toll_tax}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Permit</div>
          <div className="text-lg font-semibold">{trip.permit}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Vehicle maintainance cost</div>
          <div className="text-lg font-semibold">{trip.maintainance}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>Profit</div>
          <div className="text-lg font-semibold">{trip.profit}</div>
        </div>
        <Separator />
       
      </div>
    </div>
  );
};

export default TripDetailsPage;
