'use client';

import { DashboardCalender } from "@/components/DashboardCalender";
import { RadialChart } from "@/components/RadialChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHeader } from "@/hooks/use-header";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const Dashboard = () => {

  const { setTitle } = useHeader();

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
  // Sample dates for trips
  const tripDates = [
    new Date(2025, 1, 16),  // Feb 16, 2025
    new Date(2025, 1, 25),  // Feb 25, 2025
    new Date(2025, 2, 5),   // March 5, 2025
  ];

  const taskDates = [
    new Date(2025, 1, 20),  // Feb 20, 2025
    new Date(2025, 2, 1),   // March 1, 2025
    new Date(2025, 2, 15),  // March 15, 2025
  ];

  // Get dates for N-7 and N-1 triggers
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      {/* Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Alerts</CardTitle>
          <CardDescription>Upcoming & overdue maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-red-500">Overdue: 2 vehicles</div>
            <div className="text-yellow-500">Due this week: 3 vehicles</div>
            <div>Next scheduled: 5 vehicles</div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Trips Calendar */}
      <Card className="flex flex-col items-center">
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>View and manage your travel schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardCalender markedDates={tripDates} />
        </CardContent>
      </Card>

      {/* Existing Tasks Calendar */}
      <Card className="flex flex-col items-center">
        <CardHeader>
          <CardTitle>Task Schedule</CardTitle>
          <CardDescription>Track your upcoming tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardCalender markedDates={taskDates} />
        </CardContent>
      </Card>


      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Fleet efficiency indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>On-Time Deliveries: 95%</div>
            <div>Average Response Time: 12 min</div>
            <div>Customer Rating: 4.8/5</div>
          </div>
        </CardContent>
      </Card>

      {/* Existing RadialChart */}
      <RadialChart />
    </div>
  );
};

export default Dashboard;
