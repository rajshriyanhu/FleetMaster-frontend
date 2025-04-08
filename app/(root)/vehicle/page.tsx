'use client'

import React, { useEffect, useState } from "react";
import AllVehicleTable from "@/components/AllVehicleTable";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useHeader } from "@/hooks/use-header";
import { Input } from "@/components/ui/input";
import { useGetAllVehicles } from "@/hooks/use-vehicle-hook";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const VehiclePage = () => {
  const router = useRouter();
  const { setTitle } = useHeader();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { data, isLoading } = useGetAllVehicles(
    currentPage,
    parseInt(searchParams.get("limit") || "20", 10),
    searchQuery,
  );

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Vehicles view and manage your vehicles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/drivers?${params.toString()}`);
  };
  
  return (
    <div className="w-full flex-col space-y-8">
      <div className="flex justify-between">
        <p className="h2 text-brand text-2xl font-semibold">
          View and Manage your Vehicles
        </p>
        <Button
          onClick={() => {
            router.push('/vehicle/upload')
          }}
        >
          <PlusCircledIcon className="text-xl font-semibold" />
          New Vehicle
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <label htmlFor="search-drivers" className="text-sm font-medium">
              Search Vehicles
            </label>
            <Input
              id="search-drivers"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>
        </div>
      <AllVehicleTable vehicles={data?.data} isLoading={isLoading} />
      {data?.pagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (data.pagination.hasPrevPage) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={
                  !data.pagination.hasPrevPage
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {Array.from(
              { length: data.pagination.totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (data.pagination.hasNextPage) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={
                  !data.pagination.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default VehiclePage;
