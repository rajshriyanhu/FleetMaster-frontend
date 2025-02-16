"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useCreateVehicle, useUpdateVehicle } from "@/hooks/use-vehicle-hook";
import { useToast } from "@/hooks/use-toast";
import { Vehicle } from "@/dto";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IndianStates } from "@/constants";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Trash2, Upload } from "lucide-react";

const alphabetOnlyRegex = /^[A-Za-z\s]+$/;

const vehicleFormSchema = () => {
  return z
    .object({
      asset_no: z.number(),
      region: z.string(),
      state: z.string().min(2).max(50),
      city: z.string().min(2).max(50).regex(alphabetOnlyRegex, {
        message: "City must contain only alphabets.",
      }),
      registration_no: z.string(),
      make: z.string().regex(alphabetOnlyRegex, {
        message: "Make must contain only alphabets.",
      }),
      model: z.string().regex(alphabetOnlyRegex, {
        message: "Model must contain only alphabets.",
      }),
      variant: z.string().regex(alphabetOnlyRegex, {
        message: "Variant must contain only alphabets.",
      }),
      transmission_type: z.string(),
      fuel_type: z.string(),
      capacity: z.number(),
      km_run: z.number(),
      color: z.string().min(2).max(50).regex(alphabetOnlyRegex, {
        message: "Color must contain only alphabets.",
      }),
      chassis_no: z.string().min(2).max(50),
      engine_no: z.string().min(2).max(50),
      manufacturing_date: z.date(),
      registration_date: z.date(),
      rc_url: z.string().optional(),
      insurance_validity: z.date(),
      insurance_url: z.string().optional(),
      puc_validity: z.date(),
      puc_url: z.string().optional(),
      fitness_validity: z.date(),
      fitness_url: z.string().optional(),
      last_battery_change: z.date().optional(),
      last_service: z.date().optional(),
      last_service_kms: z.number(),
      next_service_due: z.date(),
      next_service_due_kms: z.number(),
      gps_renewal_due: z.date().optional(),
    })
    .refine((data) => data.next_service_due_kms > data.last_service_kms, {
      message: "Next service due kms must be greater than last service kms.",
      path: ["next_service_due_kms"],
    });
};

export type vehicleFormType = z.infer<ReturnType<typeof vehicleFormSchema>>;

const VehicleForm = ({
  vehicle,
  setIsModalOpen,
}: {
  vehicle?: Vehicle;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: createVehicle, isPending: isLoading } =
    useCreateVehicle();
  const { mutateAsync: updateVehicle, isPending: isUpdatingLoading } =
    useUpdateVehicle();
  const { toast } = useToast();
  const formSchema = vehicleFormSchema();
  const uploadFile = useFileUpload();

  const [rc, setRc] = useState<File | null>(null);
  const rcInputRef = useRef<HTMLInputElement>(null);

  const [insurance, setInsurance] = useState<File | null>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);

  const [puc, setPuc] = useState<File | null>(null);
  const pucInputRef = useRef<HTMLInputElement>(null);

  const [fitness, setFitness] = useState<File | null>(null);
  const fitnessInputRef = useRef<HTMLInputElement>(null);

  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);
  const [calendarOpen3, setCalendarOpen3] = useState(false);
  const [calendarOpen4, setCalendarOpen4] = useState(false);
  const [calendarOpen5, setCalendarOpen5] = useState(false);
  const [calendarOpen6, setCalendarOpen6] = useState(false);
  const [calendarOpen7, setCalendarOpen7] = useState(false);
  const [calendarOpen8, setCalendarOpen8] = useState(false);
  const [calendarOpen9, setCalendarOpen9] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      capacity: undefined,
      chassis_no: "",
      color: "",
      engine_no: "",
      fuel_type: "",
      city: "",
      model: "",
      last_service_kms: undefined,
      next_service_due_kms: undefined,
      registration_no: "",
      region: "",
      state: "",
      transmission_type: "",
      variant: "",
      make: "",
    },
  });

  useEffect(() => {
    if (!vehicle) return;
    form.setValue("chassis_no", vehicle.chassis_no);
    form.setValue("engine_no", vehicle.engine_no);
    form.setValue("registration_no", vehicle.registration_no);
    form.setValue("city", vehicle.city);
    form.setValue("region", vehicle.region);
    form.setValue("state", vehicle.state);
    form.setValue("model", vehicle.model);
    form.setValue("variant", vehicle.variant);
    form.setValue("transmission_type", vehicle.transmission_type);
    form.setValue("fuel_type", vehicle.fuel_type);
    form.setValue("capacity", vehicle.capacity);
    form.setValue("color", vehicle.color);
    form.setValue("asset_no", vehicle.asset_no);
    form.setValue("manufacturing_date", new Date(vehicle.manufacturing_date));
    form.setValue("insurance_validity", new Date(vehicle.insurance_validity));
    form.setValue("puc_validity", new Date(vehicle.puc_validity));
    form.setValue("fitness_validity", new Date(vehicle.fitness_validity));
    form.setValue("last_battery_change", new Date(vehicle.last_battery_change));
    form.setValue("last_service", new Date(vehicle.last_service));
    form.setValue("next_service_due", new Date(vehicle.next_service_due));
    form.setValue("gps_renewal_due", new Date(vehicle.gps_renewal_due));
    form.setValue("last_service_kms", vehicle.last_service_kms);
    form.setValue("next_service_due_kms", vehicle.next_service_due_kms);
    form.setValue("last_service_kms", vehicle.last_service_kms);
    form.setValue("next_service_due_kms", vehicle.next_service_due_kms);
    form.setValue("make", vehicle.make);
    form.setValue("insurance_url", vehicle.insurance_url);
    form.setValue("rc_url", vehicle.rc_url);
    form.setValue("puc_url", vehicle.puc_url);
    form.setValue("fitness_url", vehicle.fitness_url);
  }, [vehicle, form]);

  console.log(form.formState.errors);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setErrorMessage("");
      
      if (!vehicle && (!rc || !puc || !insurance || !fitness)) {
        setErrorMessage("Please upload all required documents");
        return;
      }

      if (!vehicle) {
        const uploadPromises = [];
        
        if (rc) {
          const rcFileName = `${uuidv4()}_${rc.name}`;
          uploadPromises.push(
            uploadFile(rcFileName, rc)
              .then(() => {
                values.rc_url = rcFileName;
              })
          );
        }

        if (insurance) {
          const insuranceFileName = `${uuidv4()}_${insurance.name}`;
          uploadPromises.push(
            uploadFile(insuranceFileName, insurance)
              .then(() => {
                values.insurance_url = insuranceFileName;
              })
          );
        }

        if (puc) {
          const pucFileName = `${uuidv4()}_${puc.name}`;
          uploadPromises.push(
            uploadFile(pucFileName, puc)
              .then(() => {
                values.puc_url = pucFileName;
              })
          );
        }

        if (fitness) {
          const fitnessFileName = `${uuidv4()}_${fitness.name}`;
          uploadPromises.push(
            uploadFile(fitnessFileName, fitness)
              .then(() => {
                values.fitness_url = fitnessFileName;
              })
          );
        }

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
        
        toast({
          title: "All documents uploaded Successfully!",
        });
      }

      // Now submit the form
      if (vehicle) {
        await updateVehicle({ id: vehicle.id, values });
        toast({
          title: "Vehicle details saved successfully",
        });
        return;
      }

      await createVehicle(values);
      toast({
        title: "Vehicle created successfully",
      });
      router.push("/vehicle");

    } catch (error) {
      toast({
        title: "Uh Oh! Something went wrong",
        description: `Failed to save vehicle data: ${error}`,
        variant: "destructive",
      });
    }
  };

  const lastServiceKM = form.watch("last_service_kms");
  const nextServiceDueKM = form.watch("next_service_due_kms");

  useEffect(() => {
    if (lastServiceKM && nextServiceDueKM) {
      if (nextServiceDueKM <= lastServiceKM) {
        form.setError("next_service_due_kms", {
          message:
            "Next Service Due KMs should be greater than last Servie KMs",
        });
      } else {
        form.clearErrors("next_service_due_kms");
      }
    }
  }, [lastServiceKM, nextServiceDueKM, form]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 w-full"
        >
          <FormField
            control={form.control}
            name="asset_no"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Asset Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
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
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Region</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={vehicle ? vehicle.region : field.value}
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">State</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={vehicle ? vehicle.state : field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
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
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
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
            name="registration_no"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your registration number"
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
            name="make"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Make</FormLabel>
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Model</FormLabel>
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
            name="variant"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Variant</FormLabel>
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
            name="transmission_type"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Transmission type{" "}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        vehicle ? vehicle.transmission_type : field.value
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="AT">AT</SelectItem>
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
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Fuel Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={vehicle ? vehicle.fuel_type : field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Petrol+CNG">Petrol+CNG</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Petrol+Electric">
                          Petrol+Electric
                        </SelectItem>
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
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Seating Capacity (Driver +)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
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
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="km_run"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Total KM run
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
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
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Color of the vehicle
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
            name="chassis_no"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Chassis Number
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
            name="engine_no"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Engine Number
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
            name="manufacturing_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Date of Manufacturing
                  </FormLabel>
                  <div className="border rounded-md w-full">
                    <Popover
                      open={calendarOpen1}
                      onOpenChange={setCalendarOpen1}
                    >
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
            name="registration_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Date of Registration
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen2}
                      onOpenChange={setCalendarOpen2}
                    >
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
                          fromDate={form.getValues("manufacturing_date") || new Date(2000, 0, 1)}
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

          {vehicle ? null : (
            <div className="shad-form-item">
              <FormLabel className="shad-form-label">Upload RC</FormLabel>
              <div className="flex items-center justify-between gap-2">
                <Input
                  id="rc-upload"
                  className="hidden"
                  type="file"
                  ref={rcInputRef}
                  onChange={(e) =>
                    setRc(e.target.files ? e.target.files[0] : null)
                  }
                />
                <label
                  htmlFor="rc-upload"
                  className="rounded-md border px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer"
                >
                  {rc ? (
                    `${rc.name}`
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      Click here to upload <Upload />
                    </div>
                  )}
                </label>
                {rc && (
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => {
                      setRc(null);
                      if (rcInputRef.current) {
                        rcInputRef.current.value = "";
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="insurance_validity"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Insuarance valid upto
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen3}
                      onOpenChange={setCalendarOpen3}
                    >
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
                          fromDate={form.getValues("registration_date") || new Date(2000, 0, 1)}
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

          {vehicle ? null : (
            <div className="shad-form-item">
              <FormLabel className="shad-form-label">Upload Insurace</FormLabel>
              <div className="flex items-center justify-between gap-2">
                <Input
                  id="insurance-upload"
                  className="hidden"
                  type="file"
                  ref={insuranceInputRef}
                  onChange={(e) =>
                    setInsurance(e.target.files ? e.target.files[0] : null)
                  }
                />
                <label
                  htmlFor="insurance-upload"
                  className="rounded-md border px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer"
                >
                  {insurance ? (
                    `${insurance.name}`
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      Click here to upload <Upload />
                    </div>
                  )}
                </label>
                {insurance && (
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => {
                      setInsurance(null);
                      if (insuranceInputRef.current) {
                        insuranceInputRef.current.value = "";
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="puc_validity"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    PUC valid upto
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen4}
                      onOpenChange={setCalendarOpen4}
                    >
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
                          fromDate={form.getValues("registration_date") || new Date(2000, 0, 1)}
                          toYear={2100}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen4(false);
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

          {vehicle ? null : (
            <div className="shad-form-item">
              <FormLabel className="shad-form-label">Upload PUC</FormLabel>
              <div className="flex items-center justify-between gap-2">
                <Input
                  id="puc-upload"
                  className="hidden"
                  type="file"
                  ref={pucInputRef}
                  onChange={(e) =>
                    setPuc(e.target.files ? e.target.files[0] : null)
                  }
                />
                <label
                  htmlFor="puc-upload"
                  className="rounded-md border px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer"
                >
                  {puc ? (
                    `${puc.name}`
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      Click here to upload <Upload />
                    </div>
                  )}
                </label>
                {puc && (
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => {
                      setPuc(null);
                      if (pucInputRef.current) {
                        pucInputRef.current.value = "";
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="fitness_validity"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Fitness valid upto
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen5}
                      onOpenChange={setCalendarOpen5}
                    >
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
                          fromDate={form.getValues("registration_date") || new Date(2000, 0, 1)}
                          toYear={2100}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen5(false);
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

          {vehicle ? null : (
            <div className="shad-form-item">
              <FormLabel className="shad-form-label">Upload Fitness</FormLabel>
              <div className="flex items-center justify-between gap-2">
                <Input
                  id="fitness-upload"
                  className="hidden"
                  type="file"
                  ref={fitnessInputRef}
                  onChange={(e) =>
                    setFitness(e.target.files ? e.target.files[0] : null)
                  }
                />
                <label
                  htmlFor="fitness-upload"
                  className="rounded-md border px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer"
                >
                  {fitness ? (
                    `${fitness.name}`
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      Click here to upload <Upload />
                    </div>
                  )}
                </label>
                {fitness && (
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => {
                      setFitness(null);
                      if (fitnessInputRef.current) {
                        fitnessInputRef.current.value = "";
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="last_battery_change"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Last Battery change date (Optional)
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen6}
                      onOpenChange={setCalendarOpen6}
                    >
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
                          fromYear={1980}
                          toYear={2100}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen6(false);
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
            name="last_service"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Last Service date (Optional)
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen7}
                      onOpenChange={setCalendarOpen7}
                    >
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
                          fromYear={1980}
                          toYear={2100}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen7(false);
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
            name="last_service_kms"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Last service KMs
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className="shad-input"
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
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_service_due"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Next service due date
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen8}
                      onOpenChange={setCalendarOpen8}
                    >
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
                          fromDate={form.getValues("last_service") || new Date(2000, 0, 1)}
                          toYear={2100}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen8(false);
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
            name="next_service_due_kms"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Next service due KMs
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
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
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gps_renewal_due"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    GPS Subscription Renewal Date (Optional)
                  </FormLabel>
                  <div className="w-full border rounded-md">
                    <Popover
                      open={calendarOpen9}
                      onOpenChange={setCalendarOpen9}
                    >
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
                          fromYear={1980}
                          toYear={2100}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen9(false);
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

          {vehicle ? (
            <div className="my-3 flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  if (setIsModalOpen) setIsModalOpen(false);
                  router.push("/vehicle");
                }}
                className="modal-cancel-button"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading || isUpdatingLoading}
                className="modal-submit-button"
                type="submit"
              >
                Submit
                {(isLoading || isUpdatingLoading) && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    height={24}
                    width={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </Button>
            </div>
          ) : (
            <Button className="modal-submit-button" type="submit">
              Submit
              {(isLoading || isUpdatingLoading) && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  height={24}
                  width={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>
          )}

          {errorMessage && <p className="error-message">*{errorMessage}</p>}
        </form>
      </Form>
    </>
  );
};

export default VehicleForm;
