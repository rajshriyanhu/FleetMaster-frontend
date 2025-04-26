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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePicker } from "../time-picker/time-picker";
import { Calendar } from "../time-picker/calender-time";
import { useEffect, useState } from "react";
import { passengerCapacity, vehicle } from "./utils";
import {
  useOutstationQuotationImage,
} from "@/hooks/use-form-hook";
// import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  start_date_time: z.date(),
  end_date_time: z.date(),
  days: z.number(),
  start_location: z.string().min(2),
  end_location: z.string().min(2),
  location_visit: z.string().min(2),
  passenger: z.string(),
  vehicle: z.string(),
  carrier: z.string(),
  cost_per_km: z.number(),
  billing_per_day: z.number(),
  driver_allowance_per_day: z.number(),
  total_billing: z.number(),
  total_driver_allowance: z.number(),
  toll: z.number(),
  state_tax: z.number(),
  total: z.number(),
  advance: z.number(),
});

export type OutstationQuotationFormSchema = z.infer<typeof formSchema>;

const OutstationQuotationForm = () => {
  const { mutate } = useOutstationQuotationImage();
  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);
  const [newVehicleArray, setNewVehicleArray] = useState(vehicle);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: 0,
      start_location: "",
      end_location: "",
      location_visit: "",
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
        a.download = "outstation-quotation.png";
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

  const startDate = form.watch("start_date_time");
  const endDate = form.watch("end_date_time");
  const days = form.watch("days");
  const billingPerDay = form.watch("billing_per_day");
  const driverAllowancePerDay = form.watch("driver_allowance_per_day");
  const totalBilling = form.watch("total_billing");
  const toll = form.watch("toll");
  const stateTax = form.watch("state_tax");
  const advance = form.watch("advance");
  const total = form.watch("total");
  const costperKM = form.watch("cost_per_km");
  const totalDriverAllowance = form.watch("total_driver_allowance");
  const capacity = form.watch("passenger");

  useEffect(() => {
    if (startDate && endDate) {
      const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
      form.setValue("days", Math.floor(daysDifference) + 1);
    }

    if (billingPerDay && days) {
      form.setValue("total_billing", billingPerDay * days);
    }

    if (driverAllowancePerDay && days) {
      form.setValue("total_driver_allowance", days * driverAllowancePerDay);
    }

    if (costperKM && totalBilling && totalDriverAllowance && toll && stateTax) {
      form.setValue(
        "total",
        costperKM * totalBilling +
          totalBilling +
          toll +
          totalDriverAllowance +
          stateTax
      );
    }

    if (total) {
      form.setValue("advance", total * 0.1);
    }

    if (capacity && capacity === passengerCapacity[1]) {
      setNewVehicleArray(vehicle.slice(2, 5));
    } else if (capacity && capacity === passengerCapacity[2]) {
      setNewVehicleArray(vehicle.slice(3, 5));
    } else if (capacity && capacity === passengerCapacity[3]) {
      setNewVehicleArray(vehicle.slice(4, 5));
    } else if (capacity && capacity === passengerCapacity[0]) {
      setNewVehicleArray(vehicle);
    }
  }, [
    startDate,
    endDate,
    billingPerDay,
    totalBilling,
    driverAllowancePerDay,
    costperKM,
    toll,
    stateTax,
    total,
    capacity,
    form,
  ]);

  console.log(form.formState.errors);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 p-4"
        >
          <h2 className="text-xl font-semibold text-center ">
            Quotation - Outstation
          </h2>
          <FormField
            control={form.control}
            name="start_date_time"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Start Date and Time
                </FormLabel>
                <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
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
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                    />
                    <div className="border-t p-3">
                      <TimePicker
                        setDate={field.onChange}
                        date={field.value}
                        setCalendarOpen={setCalendarOpen1}
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
            name="end_date_time"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  End Date and Time
                </FormLabel>
                <Popover open={calendarOpen2} onOpenChange={setCalendarOpen2}>
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
                      fromDate={form.getValues("start_date_time")}
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                    />
                    <div className="border-t p-3">
                      <TimePicker
                        setDate={field.onChange}
                        date={field.value}
                        setCalendarOpen={setCalendarOpen2}
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
            name="days"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Number of Days
                </FormLabel>
                <FormControl>
                  <Input
                    className="shad-input"
                    {...field}
                    value={
                      field.value !== undefined && field.value !== null
                        ? field.value
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // Allow only numeric values
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }
                    }}
                  />
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
            name="cost_per_km"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Cost per KM (₹)
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
            name="billing_per_day"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Minimum / Average KMs Billing Per Day (₹)
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
            name="driver_allowance_per_day"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Driver Allowance Per Day (₹)
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
            name="total_billing"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Total Minimum / Average KMs Billing (₹)
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    {...field}
                    readOnly
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? Number(e.target.value) : ""
                      );
                    }}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_driver_allowance"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Total Driver Allowance (₹)
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
            name="toll"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Approx Toll (₹)
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
            name="state_tax"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_3fr] gap-4">
                <FormLabel className="mt-2 flex items-center justify-end">
                  Approx State Tax / Permit (₹)
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
                  Pay 10% advance to cinfirm the trip (₹)
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
                    readOnly
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

export default OutstationQuotationForm;
