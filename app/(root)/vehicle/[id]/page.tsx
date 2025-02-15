"use client";

import { Vehicle } from "@/dto";
import { useToast } from "@/hooks/use-toast";
import { useDeleteVehicle, useGetVehicleById } from "@/hooks/use-vehicle-hook";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { EyeIcon, PlusCircleIcon, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const VehicleDetailsPage = () => {
  const params = useParams();
  const router = useRouter()
  const { toast } = useToast();
  const { data, isLoading, isError } = useGetVehicleById(params.id as string);
  const { mutateAsync: deleteVehicleEntry } = useDeleteVehicle(
    params.id as string
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  if (isLoading) return <>Loading</>;

  if (isError) return <>Something wnet wrong</>;

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
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2">
              <Settings className="size-4 text-brand" /> Settings
            </DropdownMenuTrigger>
            <DropdownMenuContent alignOffset={20}>
              <DropdownMenuItem onClick={() => setIsExpenseModalOpen(true)}>
                <PlusCircleIcon className="size-8" />
                Create Expense
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/vehicle/${vehicle.id}/expense`)}>
                <EyeIcon className="size-8" />
                View All Expenses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/vehicle/${vehicle.id}/edit`)}>
                <Pencil1Icon className="size-8" />
                Edit Vehicle Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteVehicle}>
                <TrashIcon className="size-8" />
                Delete Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
