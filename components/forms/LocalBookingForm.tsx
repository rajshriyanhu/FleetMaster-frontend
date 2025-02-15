"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, updateEndDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePicker } from "../time-picker/time-picker";
import { Calendar } from "../time-picker/calender-time";
import { useLocalBookingImage } from "@/hooks/use-form-hook";
import { useEffect, useState } from "react";
import {
  costExtraHr,
  costExtraHrMap,
  costExtraKm,
  costExtraKmMap,
  kmMap,
  packageOptions,
  passengerCapacity,
  timeMap,
  vehicle,
} from "./utils";

const formSchema = z.object({
  start_date_time: z.date(),
  end_date_time: z.string(),
  package_type: z.string().min(2),
  time_limit: z.string(),
  km_limit: z.string(),
  start_location: z.string().min(2),
  end_location: z.string().min(2),
  location_visit: z.string().min(2),
  passenger: z.string(),
  vehicle: z.string(),
  carrier: z.string(),
  cost_extra_hr: z.string(),
  cost_extra_km: z.string(),
  total: z.number(),
  advance: z.number(),
  balance: z.number(),
});

export type LocalBookingFormSchema = z.infer<typeof formSchema>;

const LocalBookingForm = () => {
  const { mutate } = useLocalBookingImage();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [newVehicleArray, setNewVehicleArray] = useState(vehicle);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      package_type: "",
      time_limit: "",
      km_limit: "",
      end_date_time: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        console.log(blob, url);
        const a = document.createElement("a");
        a.href = url;
        a.download = "local-booking.png";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      },
      onError: (err) => {
        console.error("Error generating image:", err);
      },
    });
  }

  const setTimeAndKMLimit = (value: string) => {
    form.setValue("time_limit", timeMap[value]);
    form.setValue("km_limit", kmMap[value]);
  };

  const capacity = form.watch("passenger");
  const total = form.watch("total");
  const advance = form.watch("advance");
  const vehicleName = form.watch("vehicle");

  useEffect(() => {
    if (capacity && capacity === passengerCapacity[1]) {
      setNewVehicleArray(vehicle.slice(2, 5));
    } else if (capacity && capacity === passengerCapacity[2]) {
      setNewVehicleArray(vehicle.slice(3, 5));
    } else if (capacity && capacity === passengerCapacity[3]) {
      setNewVehicleArray(vehicle.slice(4, 5));
    } else if (capacity && capacity === passengerCapacity[0]) {
      setNewVehicleArray(vehicle);
    }

    if (total && advance) {
      form.setValue("balance", total - advance);
    }

    if (vehicleName) {
      const hrValue = costExtraHrMap[vehicleName];
      const kmValue = costExtraKmMap[vehicleName];
      form.setValue("cost_extra_hr", hrValue.toString());

      form.setValue("cost_extra_km", kmValue.toString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [capacity, total, advance, vehicleName, form]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 p-4"
        >
          <h2 className="text-xl font-semibold text-center ">
            Booking Confirmation - Local
          </h2>
          <FormField
            control={form.control}
            name="start_date_time"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Date and Time
                </FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                    <div className="border-t p-3">
                      <TimePicker
                        setDate={field.onChange}
                        date={field.value}
                        setCalendarOpen={setCalendarOpen}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="package_type"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Package Type
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setTimeAndKMLimit(value);
                    const endDate = updateEndDate(
                      form.getValues("start_date_time"),
                      value
                    );
                    form.setValue("end_date_time", endDate || "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a package type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(packageOptions).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time_limit"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Time Limit
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    readOnly
                    className="w-full rounded-md border p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Km Limit Field */}
          <FormField
            control={form.control}
            name="km_limit"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Km Limit
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    readOnly
                    className="w-full rounded-md border p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date_time"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  End Date and Time
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} readOnly className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_location"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Pick Up City
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Enter start location"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_location"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Drop off City
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Enter start location"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_visit"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end text-end">
                  Locations to visit
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Enter start locations"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passenger"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Passenger Capacity
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select passenger capacity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {passengerCapacity.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Vehicle
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {newVehicleArray.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carrier"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Carrier Required
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Carrier Required" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"Yes"}>Yes</SelectItem>
                      <SelectItem value={"No"}>No</SelectItem>
                      <SelectItem value={"Not Available"}>
                        Not Available
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost_extra_hr"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Cost per Extra Hr (₹)
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select cost per extra hr" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costExtraHr.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          ₹{option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost_extra_km"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Cost per Extra KM (₹)
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select cost per extra KM" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costExtraKm.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          ₹{option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Total Approx Cost (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input bg-white"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      if (/^\d*$/.test(value)) {
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }
                    }}
                    onBlur={() => {
                      if (field.value === undefined || field.value === null) {
                        field.onChange(undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="advance"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end text-center">
                  Advance recieved (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input bg-white"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      if (/^\d*$/.test(value)) {
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }
                    }}
                    onBlur={() => {
                      if (field.value === undefined || field.value === null) {
                        field.onChange(undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end text-center">
                  Balance (Pay one day before trip date) (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input bg-white"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? `₹${new Intl.NumberFormat("en-IN").format(field.value)}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/₹|,/g, "");
                      if (/^\d*$/.test(value)) {
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }
                    }}
                    onBlur={() => {
                      if (field.value === undefined || field.value === null) {
                        field.onChange(undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button className="w-full ">Download as Image</Button>
        </form>
      </Form>
    </>
  );
};

export default LocalBookingForm;
