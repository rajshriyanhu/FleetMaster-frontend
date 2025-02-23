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
    return <>Loading...</>;
  }

  const trips = tripsData?.trips as Trip[];
  const tasks = tasksData?.vehicles as DashboardVehicle[];

  console.log("trips", trips);
  console.log("tasks", tasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <DashboardTasks tasks={tasks} taskError={taskError} />
      <DashboardTrips trips={trips} tripError={tripError} />
    </div>
  );
};

export default Dashboard;
