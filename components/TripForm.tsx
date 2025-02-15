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
import { Driver, Trip, Vehicle } from "@/dto";
import { useGetAllDrivers } from "@/hooks/use-driver-hook";
import { useGetAllVehicles } from "@/hooks/use-vehicle-hook";
import { getDaysBetweenDates } from "@/lib/utils";
import { useRouter } from "next/navigation";

const tripFormSchema = () => {
  return z.object({
    trip_type: z.string(),
    vehicle_id: z.string(),
    driver_id: z.string().min(2, "Driver id is required"),
    customer_name: z.string().min(2, "Customer name is required"),
    customer_number: z
      .string()
      .min(10, "Phone number should be of 10 digits")
      .max(10),
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
  const { data: allDrivers, isError: driverError } = useGetAllDrivers();
  const { data: allVehicle, isError: vehicleError } = useGetAllVehicles();
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
      customer_name: "",
      customer_number: "",
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
    form.setValue("driver_id", trip.driver.id);
    form.setValue("customer_name", trip.customer_name);
    form.setValue("customer_number", trip.customer_number);
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

  console.log(trip);

  const onSubmit = async (values: TripFormSchema) => {
    setErrorMessage("");
    console.log(values);
    if (trip) {
      updateTrip({ id: trip.id, values })
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

    createTrip(values)
      .then(() => {
        toast({
          title: "Trip created successfully",
        });
        form.reset();
        router.push('/trip')
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
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 w-full"
      >
        <FormField
          name="trip_type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Trip Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tripType.map((trip: string) => {
                        return (
                          <SelectItem key={trip} value={trip}>
                            {trip}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {allVehicle && !vehicleError && (
          <FormField
            name="vehicle_id"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Select a Vehicle
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allVehicle.vehicles.length > 0 ? (
                          allVehicle.vehicles.map((vehicle: Vehicle) => {
                            return (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.registration_no}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <span className="px-2 text-sm">
                            No vehicles added!
                          </span>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {allDrivers && !driverError && (
          <FormField
            name="driver_id"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Select driver
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allDrivers.drivers.length > 0 ? (
                          allDrivers.drivers.map((driver: Driver) => {
                            return (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <span className="px-2 text-sm">
                            No drivers added!
                          </span>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="shad-form-message" />
                </div>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Customer Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name of the customer"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_number"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Customer Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone number"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Starting Date of Trip
                </FormLabel>
                <div className="border rounded-md w-full">
                  <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button variant="ghost">
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
                </div>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Ending Date of Trip
                </FormLabel>
                <div className="border rounded-md w-full">
                  <Popover open={calendarOpen2} onOpenChange={setCalendarOpen2}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button variant="ghost">
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
                </div>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Number of Days
                </FormLabel>
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
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_location"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Start Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter start location"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_location"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">End Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write your destination"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location_visited"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Location Visited
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Visited location during trips"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_km"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Start Kms</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="KM at start of trip"
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_km"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">End Kms</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    placeholder="KM at end of trip"
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_km"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Total Kms run</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
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
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_fuel_cost"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Total fuel cost (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="average_fuel_cost"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Average Fuel Cost (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_average"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Vehicle average
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state_tax"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Total State Tax (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toll_tax"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Total Toll (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permit"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Total Permit (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maintainance"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Total Cost (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profit"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Profit (₹)</FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <Button>{trip ? "Save" : "Create Trip"}</Button>
      </form>
    </Form>
  );
};

export default TripForm;
