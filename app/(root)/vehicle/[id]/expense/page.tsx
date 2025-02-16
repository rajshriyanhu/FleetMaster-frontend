'use client';

import AllExpenseTable from '@/components/AllExpenseTable'
import { useHeader } from '@/hooks/use-header';
import React, { useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from 'next/navigation';

const ExpensePage = () => {
  const params = useParams();
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/vehicle">
            <BreadcrumbItem>Vehicles</BreadcrumbItem>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/vehicle/${params.id as string}`}>
            <BreadcrumbItem>Vehicle Details</BreadcrumbItem>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>View all Expenses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);
  return (
    <div className='flex flex-col space-y-8'>
      <h2 className='h2 text-brand'>All expenses for current vehicle</h2>
      <AllExpenseTable />
    </div>
  )
}

export default ExpensePage