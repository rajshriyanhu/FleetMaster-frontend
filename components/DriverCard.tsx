import { Driver } from "@/dto";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import DriverModal from "./DriverForm";
import { useDeleteDriver } from "@/hooks/use-driver-hook";

const DriverCard = ({ driver }: { driver: Driver }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAsync: deleteDriver } = useDeleteDriver();

  return (
    <>
      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle>{driver.name}</CardTitle>
          <CardDescription>
            {driver.address.city}, {driver.address.state}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <p className=" text-slate-600">Email:</p>
              <p className="font-semibold">{driver.email}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-slate-600">Phone:</p>
              <p className="font-semibold">{driver.phone_number}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-slate-600">DL number:</p>
              <p className="font-semibold">{driver.dl_number}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-slate-600">Experience:</p>
              <p className="font-semibold">{driver.experience} years</p>
            </div>
            <div className="flex gap-2">
              <p className="text-slate-600">Expertise in: </p>
              <p className="font-semibold">{driver.expertise}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={() => setIsModalOpen(true)} variant="secondary">
            Edit
          </Button>
          <Button
            onClick={() => {
                deleteDriver(driver.id)
                .then(() => {
                  toast({
                    title: "Driver deleted successfully!",
                  });
                })
                .catch((err) => {
                  toast({
                    title: "Uh Oh! Something went wrong",
                    description: `Failed to delete driver, ${err.message}`,
                    variant: "destructive",
                  });
                });
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default DriverCard;
