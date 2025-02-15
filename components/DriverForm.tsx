"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Driver } from "@/dto";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useCreateDriver, useUpdateDriver } from "@/hooks/use-driver-hook";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { indianStates } from "@/constants";
import { useRouter } from "next/navigation";

const alphabetOnlyRegex = /^[A-Za-z\s]+$/;

const driverFormSchema = () => {
  return z.object({
    name: z
      .string()
      .min(1, "Expense name is required")
      .regex(alphabetOnlyRegex, {
        message: "Name must contain only alphabets.",
      }),
    email: z.string().email(),
    phone_number: z.string(),
    alt_phone_number: z.string(),
    emg_name: z.string(),
    emg_relation: z.string(),
    emg_phone_number: z.string(),
    insurance_valid_upto: z.date(),
    joining_date: z.date(),
    exit_date: z.date().optional(),
    employment_status: z.string(),
    dl_number: z.string().min(1, "Expense type is required"),
    experience: z.number().min(0, "Experience is required"),
    expertise: z.string().min(1, "Expense type is required"),
    street: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City name is required").regex(alphabetOnlyRegex, {
      message: "City must contain only alphabets.",
    }),
    state: z.string().min(1, "State is required"),
    working_region: z.string().min(1, "Working region is required"),
    working_state: z.string().min(1, "Working state is required"),
    working_city: z
      .string()
      .min(1, "Working city is required")
      .regex(alphabetOnlyRegex, {
        message: "City must contain only alphabets.",
      }),
    postal_code: z.number(),
  });
};

export type DriverFormType = z.infer<ReturnType<typeof driverFormSchema>>;

const DriverForm = ({ driver }: { driver?: Driver }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);
  const [calendarOpen3, setCalendarOpen3] = useState(false);
  const { mutateAsync: createDriver, isPending } = useCreateDriver();
  const { mutateAsync: updateDriver, isPending: isUpdatingDriver } =
    useUpdateDriver();
  const form = useForm<DriverFormType>({
    resolver: zodResolver(driverFormSchema()),
    defaultValues: {
      name: "",
      email: "",
      phone_number: '',
      alt_phone_number: '',
      emg_name: "",
      emg_relation: "",
      emg_phone_number: '',
      dl_number: "",
      experience: undefined,
      street: "",
      city: "",
      postal_code: undefined,
      working_city: "",
    },
  });

  useEffect(() => {
    if (driver) {
      form.setValue("name", driver.name);
      form.setValue("email", driver.email);
      form.setValue("dl_number", driver.dl_number);
      form.setValue("experience", driver.experience);
      form.setValue("expertise", driver.expertise);
      form.setValue("street", driver.address.street);
      form.setValue("city", driver.address.city);
      form.setValue("state", driver.address.state);
    }
  }, [driver, form]);

  const onSubmit = (data: DriverFormType) => {
    console.log(data);
    if (driver) {
      updateDriver({ id: driver.id, values: data })
        .then(() => {
          toast({
            title: "Customer details saved successfully",
          });
        })
        .catch((err) => {
          toast({
            title: "Uh Oh! Something went wrong",
            description: `Failed to update customer details, ${err.message}`,
            variant: "destructive",
          });
        });
      return;
    }
    createDriver(data)
      .then(() => {
        toast({
          title: "Driver added successfully",
        });
        router.push('/drivers?page=1&limit=10')
        form.reset();
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to create driver, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  const postalCode = form.watch("postal_code");
  const phone = form.watch("phone_number");
  const altPhone = form.watch("alt_phone_number");
  const emgPhone = form.watch("emg_phone_number");

  useEffect(() => {
    if (postalCode !== undefined && postalCode !== null) {
      if (postalCode < 100000 || postalCode > 999999) {
        form.setError("postal_code", {
          type: "manual",
          message: "Postal code must be exactly 6 digits.",
        });
      } else {
        form.clearErrors("postal_code");
      }
    }

    if (phone) {
      if (phone.length > 0 && (phone.length !== 10 || !/^\d+$/.test(phone))) {
        form.setError("phone_number", {
          type: "manual",
          message: "Phone number must be exactly 10 digits.",
        });
      } else {
        form.clearErrors("phone_number");
      }
    }

    if (altPhone) {
      if (altPhone.length > 0 && (altPhone.length !== 10 || !/^\d+$/.test(altPhone))) {
        form.setError("alt_phone_number", {
          type: "manual",
          message: "Alternate phone number must be exactly 10 digits.",
        });
      } else {
        form.clearErrors("alt_phone_number");
      }
    }
  
    if (emgPhone) {
      if (emgPhone && (emgPhone.length !== 10 || !/^\d+$/.test(emgPhone))) {
        form.setError("emg_phone_number", {
          type: "manual",
          message: "Emergency phone number must be exactly 10 digits.",
        });
      } else {
        form.clearErrors("emg_phone_number");
      }
    }
  }, [postalCode, phone, altPhone, emgPhone, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 w-full"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Name of the driver
                </FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          name="phone_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Phone Number</FormLabel>
                <FormControl>
                <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="alt_phone_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Alternate Phone Number
                </FormLabel>
                <FormControl>
                <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="emg_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Emergency Contact (Name)
                </FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="emg_relation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Relationship of Emergency Contact
                </FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="emg_phone_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Emergency Phone Number
                </FormLabel>
                <FormControl>
                <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insurance_valid_upto"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Insurance Valid Upto
                </FormLabel>
                <div className="border rounded-md w-full">
                  <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button variant="ghost">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        captionLayout="dropdown-buttons"
                        fromDate={new Date()}
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
          name="dl_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  DL Registration Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="" className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
        <FormField
          name="experience"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Experience (years)
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
          name="expertise"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Driving Expertise
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={vehicle ? vehicle.region : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expertise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LMV">LMV</SelectItem>
                      <SelectItem value="LMV+TT">LMV + TT</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="street"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Flat/Builidng/Street Name
                </FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">City</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">State</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={vehicle ? vehicle.state : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianStates.map((state, index) => {
                        return (
                          <SelectItem key={index} value={state}>
                            {state}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="postal_code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">PIN Code</FormLabel>
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
          name="working_region"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Working Region
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={vehicle ? vehicle.region : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="working_state"
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Working State</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={vehicle ? vehicle.state : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select working state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianStates.map((state, index) => {
                        return (
                          <SelectItem key={index} value={state}>
                            {state}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          name="working_city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Working City</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joining_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Joining Date</FormLabel>
                <div className="border rounded-md w-full">
                  <Popover open={calendarOpen2} onOpenChange={setCalendarOpen2}>
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
                          setCalendarOpen2(false);
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
          name="exit_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">Exit Date</FormLabel>
                <div className="border rounded-md w-full">
                  <Popover open={calendarOpen3} onOpenChange={setCalendarOpen3}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button variant="ghost">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick exit date</span>
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
                          setCalendarOpen3(false);
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
          name="employment_status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Employement Status
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={vehicle ? vehicle.region : field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Non-Active">Non Active</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <Button className="modal-submit-button">
          Submit
          {(isPending || isUpdatingDriver) && (
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              height={24}
              width={24}
              className="ml-2 animate-spin"
            />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DriverForm;
