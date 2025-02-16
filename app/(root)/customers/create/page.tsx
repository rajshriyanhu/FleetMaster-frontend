"use client";

import CustomerForm from "@/components/CustomerForm";
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

const CustomerPage = () => {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
        <BreadcrumbLink href="/customers">
        Customer</BreadcrumbLink>
        <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add new Customer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter Customer Details
      </h2>
      <CustomerForm />
    </div>
  );
};

export default CustomerPage;
