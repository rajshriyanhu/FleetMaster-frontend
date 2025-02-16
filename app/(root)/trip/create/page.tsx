"use client";

import TripForm from "@/components/TripForm";
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

const CreateTripPage = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/trip">Trip</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add new trip</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter Trip Details
      </h2>
      <TripForm />
    </div>
  );
};

export default CreateTripPage;
