"use client";

import { Vehicle } from "@/dto";
import { useToast } from "@/hooks/use-toast";
import { useDeleteVehicle, useGetVehicleById } from "@/hooks/use-vehicle-hook";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { EyeIcon, PlusCircleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import VehicleDetailsList from "@/components/VehicleDetailsList";
import ExpenseModal from "@/components/ExpenseModal";
import { useHeader } from "@/hooks/use-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/skeleton-card";
import { Error } from "@/components/error";

const VehicleDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, isError } = useGetVehicleById(params.id as string);
  const { mutateAsync: deleteVehicleEntry } = useDeleteVehicle(
    params.id as string
  );
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
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
            <BreadcrumbPage>Vehicle details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  if (isLoading) return <div>
    <SkeletonCard />
  </div>

  if (isError) return <Error />

  const vehicle: Vehicle = data.vehicle;

  const handleDeleteVehicle = async () => {
    await deleteVehicleEntry()
      .then(() => {
        toast({
          title: "Vehicle entry deleted successfully!",
        });
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to delete vehicle entry, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex-col justify-center space-y-8">
      <div className="flex w-full justify-between ">
        <p className="text-brand text-xl font-bold">{vehicle.model}</p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            <PlusCircleIcon className="h-4 w-4" />
            Add Expense
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push(`/vehicle/${vehicle.id}/expense`)}
          >
            <EyeIcon className="h-4 w-4" />
            View Expenses
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push(`/vehicle/${vehicle.id}/edit`)}
          >
            <Pencil1Icon className="h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDeleteVehicle}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <VehicleDetailsList vehicle={vehicle} />
      </div>

      <ExpenseModal
        type="create"
        isModalOpen={isExpenseModalOpen}
        setIsModalOpen={setIsExpenseModalOpen}
        vehicle={vehicle}
      />
    </div>
  );
};

export default VehicleDetailsPage;
