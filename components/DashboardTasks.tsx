import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { DashboardVehicle } from '@/dto';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardTasks({
    tasks,
    taskError,
} : {
    tasks: DashboardVehicle[];
    taskError: boolean;
}) {
    if(!tasks || taskError)return <>
        Error
    </>;
  return (
    <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Vehicle Due Tasks</CardTitle>
          <CardDescription>Tasks due in the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((vehicle: DashboardVehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col space-y-3 rounded-lg border p-4 bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{vehicle.registration_no}</div>
                  <div className="text-sm text-muted-foreground">
                    {vehicle.make} {vehicle.model}
                  </div>
                </div>
                <div className="space-y-2">
                  {vehicle.dueTasks.map((task) => {
                    let dueDate;
                    if (task === "insurance_validity") {
                      dueDate = vehicle.insurance_validity;
                    } else if (task === "puc_validity") {
                      dueDate = vehicle.puc_validity;
                    } else if (task === "fitness_validity") {
                      dueDate = vehicle.fitness_validity;
                    } else if (task === "last_battery_change") {
                      dueDate = vehicle.last_battery_change;
                    } else if (task === "next_service_due") {
                      dueDate = vehicle.next_service_due;
                    } else if (task === "gps_renewal_due") {
                      dueDate = vehicle.gps_renewal_due;
                    }

                    return (
                      <div
                        key={`${vehicle.id}-${task}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div className="flex flex-col">
                          <span className="capitalize font-medium">
                            {task.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Due: {format(new Date(dueDate!), "dd MMM yyyy")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}
