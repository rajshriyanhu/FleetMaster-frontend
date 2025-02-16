"use client";

import AllDriverTable from "@/components/AllDriverTable";
import { Button } from "@/components/ui/button";
import { useGetAllDrivers } from "@/hooks/use-driver-hook";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useHeader } from "@/hooks/use-header";

const DriverPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { data, isLoading } = useGetAllDrivers(
    currentPage,
    parseInt(searchParams.get("limit") || "20", 10),
    searchQuery,
    sortBy
  );
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Drivers</BreadcrumbPage>
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
    <>
      <div className="w-full flex-col space-y-8">
        <div className="flex justify-between">
          <p className="h2 text-brand text-2xl font-semibold">
            View and manage your drivers
          </p>
          <Button
            onClick={() => {
              router.push("/drivers/create");
            }}
            className="rounded-full"
          >
            <PlusCircledIcon className="text-xl font-semibold" />
            New Driver
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <label htmlFor="search-drivers" className="text-sm font-medium">
              Search Drivers
            </label>
            <Input
              id="search-drivers"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="sort-drivers" className="text-sm font-medium">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-drivers" className="w-[200px]">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="created_at">Date Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AllDriverTable drivers={data?.data} isLoading={isLoading} />
      </div>
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
    </>
  );
};

export default DriverPage;
