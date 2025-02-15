"use client";
import DriverForm from "@/components/DriverForm";
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

const CreateDriverPage = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/drivers">
            <BreadcrumbItem>Drivers</BreadcrumbItem>
          </BreadcrumbLink>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbPage>Add Driver</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter Driver Details
      </h2>
      <DriverForm />
    </div>
  );
};

export default CreateDriverPage;
