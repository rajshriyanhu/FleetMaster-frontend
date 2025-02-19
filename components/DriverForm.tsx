"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useCreateDriver, useUpdateDriver } from "@/hooks/use-driver-hook";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Upload } from "lucide-react";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IndianStates } from "@/constants";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { downloadFile } from "@/hooks/use-fle-donwload";
import { useFileUpload } from "@/hooks/use-file-upload";

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
    document_url: z.string(),
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
  const uploadFile = useFileUpload();
  const [document, setDocument] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DriverFormType>({
    resolver: zodResolver(driverFormSchema()),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      alt_phone_number: "",
      emg_name: "",
      emg_relation: "",
      emg_phone_number: "",
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

  console.log(form.formState.errors);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      toast({
        title: "Failed to upload file",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    uploadFile(`${driver?.document_url}`, e.target.files[0])
      .then(() => {
        toast({
          title: "File uploaded successfully!",
        });
      })
      .catch((err) => {
        toast({
          title: "Failed to upload document",
          variant: "destructive",
        });
        console.log(err);
        return;
      });
  };

  const onSubmit = (data: DriverFormType) => {
    console.log(data);
    if (!document) {
      return;
    }
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}_${document.name}`;
    uploadFile(fileName, document)
      .then((res) => {
          form.setValue("document_url", res.filename);
      })
      .catch((err) => {
        toast({
          title: "Failed to upload document",
          variant: "destructive",
        });
        return;
      });
    if (driver) {
      updateDriver({ id: driver.id, values: data })
        .then(() => {
          toast({
            title: "Driver details saved successfully",
          });
        })
        .catch((err) => {
          toast({
            title: "Uh Oh! Something went wrong",
            description: `Failed to update driver details, ${err.message}`,
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
        router.push("/drivers?page=1&limit=10");
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
      if (
        altPhone.length > 0 &&
        (altPhone.length !== 10 || !/^\d+$/.test(altPhone))
      ) {
        form.setError("alt_phone_number", {
          type: "manual",
          message: "Phone number must be exactly 10 digits.",
        });
      } else {
        form.clearErrors("alt_phone_number");
      }
    }

    if (emgPhone) {
      if (emgPhone && (emgPhone.length !== 10 || !/^\d+$/.test(emgPhone))) {
        form.setError("emg_phone_number", {
          type: "manual",
          message: "Phone number must be exactly 10 digits.",
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
        className="space-y-8 w-full px-8"
      >
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg border shadow-sm ">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter driver's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="10-digit mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="alt_phone_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Alternative contact number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="working_region"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Region</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="working_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working State</FormLabel>
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
                        {IndianStates.map((state, index) => {
                          return (
                            <SelectItem key={index} value={state}>
                              {state}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="working_city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {driver ? (
              <div className="flex justify-between items-center px-2 border rounded-md gap-4 bg-white">
                <div>Document</div>
                <div className="flex justify-between">
                  <Button
                    onClick={() => downloadFile(driver.document_url)}
                    variant="ghost"
                    className="text-lg font-semibold"
                    type="button"
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-lg font-semibold"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        id="upload"
                        className="hidden"
                        type="file"
                        onChange={(e) => handleFileUpload(e)}
                      />
                      <label
                        htmlFor="upload"
                        className="rounded-md px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer"
                      >
                        <div className="w-full flex items-center justify-between gap-2">
                          Replace <Upload />
                        </div>
                      </label>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <FormItem>
              
                <FormLabel>
                  Upload Document
                </FormLabel>
                <div className="flex items-center gap-2">
                    <Input
                      id="puc-upload"
                      type="file"
                      className="hidden"
                      ref={inputRef}
                      onChange={(e) =>
                        setDocument(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    <FormControl>
                      <label
                        htmlFor="puc-upload"
                        className="flex w-full h-[2.3rem] cursor-pointer items-center justify-between rounded-md border px-3 py-2"
                      >
                        <span>{document ? document.name : "Click here to upload"}</span>
                        {!document && <Upload className="h-4 w-4" />}
                      </label>
                    </FormControl>
                    {document && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDocument(null);
                          if (inputRef.current) {
                            inputRef.current.value = "";
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
              </FormItem>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Emergency Contact
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              name="emg_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Emergency contact person" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="emg_relation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input placeholder="Relationship with driver" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="emg_phone_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Emergency contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Professional Details
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="insurance_valid_upto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Validity</FormLabel>
                  <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen1(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dl_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DL Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Driver's License Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="experience"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience (Years)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Years of experience"
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
              name="expertise"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving Expertise</FormLabel>
                  <Select onValueChange={field.onChange}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joining_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Date</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Date</FormLabel>
                  <Popover open={calendarOpen3} onOpenChange={setCalendarOpen3}>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="employment_status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employement Status</FormLabel>
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
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Residential Address
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              name="street"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Flat no., Building name, Street"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {IndianStates.map((state, index) => (
                        <SelectItem key={index} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="postal_code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="6-digit PIN code"
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
            disabled={isPending || isUpdatingDriver}
          >
            {isPending || isUpdatingDriver ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {driver ? "Saving..." : "Creating..."}
              </div>
            ) : driver ? (
              "Save Changes"
            ) : (
              "Create Driver"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DriverForm;
