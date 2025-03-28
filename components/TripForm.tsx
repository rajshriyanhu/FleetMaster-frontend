"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useCreateTrip, useUpdateTrip } from "@/hooks/use-trip-hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Customer, Driver, Trip, Vehicle } from "@/dto";
import { useGetAllDrivers } from "@/hooks/use-driver-hook";
import { useGetAllVehicles } from "@/hooks/use-vehicle-hook";
import { cn, getDaysBetweenDates } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useGetAllCustomers } from "@/hooks/use-customer-hook";

const tripFormSchema = () => {
  return z.object({
    trip_type: z.string(),
    vehicle_id: z.string(),
    vehicle_model: z.string(),
    driver_id: z.string().min(2, "Driver id is required"),
    customer_id: z.string().min(2, "Driver id is required"),
    // customer_name: z.string().min(2, "Customer name is required"),
    // customer_number: z
    //   .string()
    //   .min(10, "Phone number should be of 10 digits")
    //   .max(10),
    start_date: z.date(),
    end_date: z.date(),
    days: z.number(),
    start_location: z.string().min(2).max(50),
    end_location: z.string().min(2).max(50),
    location_visited: z.string().min(2).max(50),
    start_km: z.number(),
    end_km: z.number(),
    total_km: z.number(),
    total_fuel_cost: z.number(),
    average_fuel_cost: z.number(),
    vehicle_average: z.number(),
    state_tax: z.number(),
    toll_tax: z.number(),
    permit: z.number(),
    maintainance: z.number(),
    profit: z.number(),
  });
};

export type TripFormSchema = z.infer<ReturnType<typeof tripFormSchema>>;

const TripForm = ({ trip }: { trip?: Trip }) => {
  const router = useRouter();
  const { data: allDrivers, isError: driverError } = useGetAllDrivers(
    1,
    20,
    "",
    "name"
  );
  const { data: allCustomers, isError: customerError } = useGetAllCustomers(
    1,
    20,
    "",
    "name"
  );

  const { data: allVehicle, isError: vehicleError } = useGetAllVehicles(1, 100, '');
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: createTrip, isPending: isLoading } = useCreateTrip();
  const { mutateAsync: updateTrip, isPending: isUpdatingLoading } =
    useUpdateTrip();
  const { toast } = useToast();
  const formSchema = tripFormSchema();
  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(
    undefined
  );

  const tripType = ["Uber", "Ola", "Outstation", "Local", "Lumpsum"];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_location: "",
      end_location: "",
      location_visited: "",
      start_km: undefined,
      end_km: undefined,
      days: undefined,
      total_km: undefined,
      total_fuel_cost: undefined,
      average_fuel_cost: undefined,
      vehicle_average: undefined,
      state_tax: undefined,
      toll_tax: undefined,
      permit: undefined,
      maintainance: undefined,
      profit: undefined,
    },
  });

  useEffect(() => {
    if (!trip) return;
    form.setValue("trip_type", trip.trip_type);
    form.setValue("vehicle_id", trip.vehicle.id);
    form.setValue("vehicle_model", trip.vehicle.model);
    form.setValue("driver_id", trip.driver.id);
    form.setValue("customer_id", trip.customer_id);
    form.setValue("start_date", new Date(trip.start_date));
    form.setValue("end_date", new Date(trip.end_date));
    form.setValue("days", trip.days);
    form.setValue("start_location", trip.start_location);
    form.setValue("end_location", trip.end_location);
    form.setValue("location_visited", trip.location_visited);
    form.setValue("start_km", trip.start_km);
    form.setValue("end_km", trip.end_km);
    form.setValue("total_km", trip.total_km);
    form.setValue("total_fuel_cost", trip.total_fuel_cost);
    form.setValue("average_fuel_cost", trip.average_fuel_cost);
    form.setValue("vehicle_average", trip.vehicle_average);
    form.setValue("state_tax", trip.state_tax);
    form.setValue("toll_tax", trip.toll_tax);
    form.setValue("permit", trip.permit);
    form.setValue("maintainance", trip.maintainance);
    form.setValue("profit", trip.profit);
  }, [trip]);

  const onSubmit = async (values: TripFormSchema) => {
    setErrorMessage("");
    const { vehicle_model, ...submitValues } = values;
    console.log(values);
    if (trip) {
      await updateTrip({ id: trip.id, values })
        .then(() => {
          toast({
            title: "Trip details saved successfully",
          });
        })
        .catch((err) => {
          toast({
            title: "Uh Oh! Something went wrong",
            description: `Failed to update trip, ${err.message}`,
            variant: "destructive",
          });
        });
      return;
    }

    await createTrip(values)
      .then(() => {
        toast({
          title: "Trip created successfully",
        });
        form.reset();
        router.push("/trip");
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to create trip, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  const startDate = form.watch("start_date");
  const endDate = form.watch("end_date");
  const startKm = form.watch("start_km");
  const endKm = form.watch("end_km");
  const totalFuelCost = form.watch("total_fuel_cost");
  const totalStateTax = form.watch("state_tax");
  const toll = form.watch("toll_tax");
  const permit = form.watch("permit");
  const averageFuelCost = form.watch("average_fuel_cost");
  const vehicleId = form.watch("vehicle_id");
  // const totalCost = form.watch('maintainance')

  useEffect(() => {
    if (startDate && endDate) {
      form.setValue("days", getDaysBetweenDates(startDate, endDate));
    }
    if (startKm && endKm) {
      form.setValue("total_km", endKm - startKm);
    }
    if (totalFuelCost && averageFuelCost) {
      form.setValue("vehicle_average", totalFuelCost / averageFuelCost);
    }
    if (vehicleId) {
      if (trip) {
        setSelectedVehicle(trip.vehicle);
      } else
        setSelectedVehicle(
          allVehicle.vehicles.find(
            (vehicle: Vehicle) => vehicle.id === vehicleId
          )
        );
    }
    if (
      !trip &&
      vehicleId &&
      selectedVehicle &&
      startKm < selectedVehicle.km_run
    ) {
      form.setError("start_km", {
        message: `Start Kms must be greater vehicle's km run (${selectedVehicle.km_run})`,
      });
    } else {
      form.clearErrors("start_km");
    }
    if (vehicleId && selectedVehicle && endKm < selectedVehicle.km_run) {
      form.setError("end_km", {
        message: `End Kms must be greater vehicle's km run (${selectedVehicle.km_run})`,
      });
    } else if (endKm <= startKm) {
      form.setError("end_km", {
        message: "End Kms must be greater than Start Kms",
      });
    } else {
      form.clearErrors("end_km");
    }
    if (totalFuelCost && totalStateTax && toll && permit) {
      form.setValue(
        "maintainance",
        totalFuelCost + totalStateTax + toll + permit
      );
    }
  }, [
    startDate,
    endDate,
    startKm,
    endKm,
    totalFuelCost,
    averageFuelCost,
    totalStateTax,
    toll,
    permit,
    vehicleId,
    form,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-8 w-full"
      >
        {/* Basic Trip Information */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Basic Trip Information
          </h3>
          {/* Warning Messages */}
          <div className="mb-4">
            {(!allVehicle?.data || allVehicle.data.length === 0) && (
              <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-2">
                ⚠️ No vehicles available. You need at least one vehicle to
                create a trip.
              </p>
            )}
            {(!allDrivers?.data || allDrivers.data.length === 0) && (
              <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-2">
                ⚠️ No drivers available. You need at least one driver to create
                a trip.
              </p>
            )}
            {(!allCustomers?.data || allCustomers.data.length === 0) && (
              <p className="text-yellow-600 bg-yellow-50 p-2 rounded mb-2">
                ⚠️ No customers available. You need at least one customer to
                create a trip.
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              name="trip_type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tripType.map((trip: string) => (
                          <SelectItem key={trip} value={trip}>
                            {trip}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {allVehicle && !vehicleError && (
              <>
                <FormField
                  name="vehicle_model"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle Model</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset vehicle selection when model changes
                            form.setValue("vehicle_id", "");
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle model" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Ensure TypeScript understands the type of model */}
                            {Array.from(
                              new Set(
                                allVehicle.data.map((v: Vehicle) => v.model)
                              )
                            ).map((model) => (
                              <SelectItem
                                key={String(model)}
                                value={String(model)}
                              >
                                {String(model)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="vehicle_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!form.watch("vehicle_model")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {allVehicle.data
                              .filter(
                                (v: Vehicle) =>
                                  v.model === form.watch("vehicle_model")
                              )
                              .map((vehicle: Vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.registration_no}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {allDrivers && allDrivers.data && !driverError && (
              <FormField
                name="driver_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select driver</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {allDrivers?.data.length > 0 ? (
                            allDrivers?.data.map((driver: Driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))
                          ) : (
                            <span className="px-2 text-sm">
                              No drivers added!
                            </span>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {allCustomers && allCustomers.data && !customerError && (
              <FormField
                name="customer_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select driver</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCustomers.data.length > 0 ? (
                            allCustomers.data.map((customer: Customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))
                          ) : (
                            <span className="px-2 text-sm">
                              No customer added!
                            </span>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Trip Schedule */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Trip Schedule
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Date of Trip</FormLabel>
                  <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick start date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        captionLayout="dropdown-buttons"
                        fromYear={1980}
                        toYear={2100}
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen1(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ending Date of Trip</FormLabel>
                  <Popover open={calendarOpen2} onOpenChange={setCalendarOpen2}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick end date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        captionLayout="dropdown-buttons"
                        fromYear={1980}
                        toYear={2100}
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date); // Update the form field value
                          setCalendarOpen2(false); // Close the popover
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Days</FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
                      {...field}
                      readOnly
                      placeholder="Trip days"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? Number(e.target.value) : ""
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Location Details
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Start Location, End Location, Locations Visited */}
            <FormField
              control={form.control}
              name="start_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter start location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your destination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_visited"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Visited</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Visited location during trips"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Distance Tracking */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Distance Tracking
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Start KM, End KM, Total KM */}
            <FormField
              control={form.control}
              name="start_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Kms</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                      placeholder="KM at start of trip"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Kms</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                      placeholder="KM at end of trip"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_km"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Kms run</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? Number(e.target.value) : ""
                        );
                      }}
                      placeholder="Total KM run during the trip"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Cost Details */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Cost Details
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* All cost related fields */}
            <FormField
              control={form.control}
              name="total_fuel_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total fuel cost (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="average_fuel_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Fuel Cost (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle_average"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle average</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state_tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total State Tax (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toll_tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Toll (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Permit (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintainance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cost (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profit (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, "");
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="min-w-[120px]"
            disabled={isLoading || isUpdatingLoading}
          >
            {isLoading || isUpdatingLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {trip ? "Saving..." : "Creating..."}
              </div>
            ) : trip ? (
              "Save Changes"
            ) : (
              "Create Trip"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TripForm;
