"use client";

import { useHeader } from "@/hooks/use-header";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  useGetDashboardTasks,
  useGetDashboardTrips,
} from "@/hooks/use-dashboard-hook";
import { DashboardVehicle, Trip } from "@/dto";
import DashboardTasks from "@/components/DashboardTasks";
import DashboardTrips from "@/components/DashboardTrips";
import { SkeletonCard } from "@/components/skeleton-card";
import { Error } from "@/components/error";

const Dashboard = () => {
  const { setTitle } = useHeader();
  const {
    data: tripsData,
    isLoading: tripLoading,
    isError: tripError,
  } = useGetDashboardTrips();
  const {
    data: tasksData,
    isLoading: taskLoading,
    isError: taskError,
  } = useGetDashboardTasks();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  if (tripLoading || taskLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (taskError || tripError) {
    return <Error />;
  }

  const trips = tripsData?.trips as Trip[];
  const tasks = tasksData?.vehicles as DashboardVehicle[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <DashboardTasks tasks={tasks} taskError={taskError} />
      <DashboardTrips trips={trips} tripError={tripError} />
    </div>
  );
};

export default Dashboard;
