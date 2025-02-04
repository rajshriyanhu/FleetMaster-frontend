"use client";

import AllTripTable from "@/components/AllTripTable";
import TripModal from "@/components/trip-modal/TripModal";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TripPage = () => {
  const router = useRouter();
  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          View and Manage your trips
        </p>
        <Button
          onClick={() => {
            router.push("/trip/create");
          }}
          className="rounded-full"
        >
          <PlusCircledIcon className="text-xl font-semibold" />
          New Trip
        </Button>
      </div>

      <AllTripTable />
    </div>
  );
};

export default TripPage;
