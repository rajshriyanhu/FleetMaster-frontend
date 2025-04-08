'use client';

import CustomerForm from "@/components/CustomerForm";
import { SkeletonCard } from "@/components/skeleton-card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Customer } from "@/dto";
import { useGetCustomerById } from "@/hooks/use-customer-hook";
import { useHeader } from "@/hooks/use-header";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditCustomerPage() {
    const params = useParams();
    const { data, isLoading, isError } = useGetCustomerById(params.id as string);
    const { setTitle } = useHeader();
  
    useEffect(() => {
      setTitle(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink href="/customers">Customer</BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }, []);
  
    if (isLoading) return <div className="py-8 space-y-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  
    if (isError) return <>Something went wrong</>;
  
    const customer: Customer = data.customer;

    console.log(customer);
    return (
      <div className="flex flex-col items-center justify-center space-y-8">
        <h2 className="h2 text-brand text-2xl font-semibold">
          Edit customer details
        </h2>
        <CustomerForm user={customer} />
      </div>
    );
}
