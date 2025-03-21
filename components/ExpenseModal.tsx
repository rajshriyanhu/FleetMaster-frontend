import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense, ExpenseType, Vehicle } from "@/dto";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Trash2, Upload } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import {
  CreateExpenseRequest,
  useCreateExpense,
  useUpdateExpense,
} from "@/hooks/use-expense-hook";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

const expenseFormSchema = () => {
  return z.object({
    description: z.string().min(1, "Expense description is required"),
    type: z.string().min(1, "Expense type is required"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    date: z.date(),
    file_url: z.string(),
  });
};

export type expenseFormType = z.infer<ReturnType<typeof expenseFormSchema>>;
const ExpenseModal = ({
  expense,
  vehicle,
  type,
  isModalOpen,
  setIsModalOpen,
}: {
  expense?: Expense;
  vehicle: Vehicle;
  type: "create" | "edit";
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const { mutateAsync: createExpense, isPending } = useCreateExpense();
  const { mutateAsync: updateExpense, isPending: isUpdatingExpense } =
    useUpdateExpense();
  const uploadFile = useFileUpload();

  const [document, setDocument] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<expenseFormType>({
    resolver: zodResolver(expenseFormSchema()),
    defaultValues: {
      description: "",
      file_url: "",
    },
  });

  useEffect(() => {
    if (expense) {
      form.setValue("description", expense.description);
      form.setValue("type", expense.type);
      form.setValue("amount", expense.amount);
      form.setValue("date", new Date(expense.date));
      form.setValue("file_url", expense.file_url);
    }
  }, [expense, form]);

  const onSubmit = async (data: expenseFormType) => {
    if (!document) {
      return;
    }
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}_${document.name}`;
    uploadFile(fileName, document)
      .then((res) => {
        form.setValue("file_url", res.filename);
      })
      .catch((err) => {
        toast({
          title: "Failed to upload document",
          variant: "destructive",
        });
        return;
      });
    const request: CreateExpenseRequest = {
      file_url: fileName,
      description: data.description,
      type: data.type,
      amount: data.amount,
      date: data.date,
      vehicle_id: vehicle.id,
      chassis_no: vehicle.chassis_no,
    };
    if (expense) {
      await updateExpense({ id: expense.id, values: request })
        .then(() => {
          toast({
            title: "Expense details saved successfully",
          });
          setIsModalOpen(false);
        })
        .catch((err) => {
          toast({
            title: "Uh Oh! Something went wrong",
            description: `Failed to update expense, ${err.message}`,
            variant: "destructive",
          });
        });
      return;
    }
    await createExpense(request)
      .then(() => {
        toast({
          title: "Expense added successfully",
        });
        setIsModalOpen(false);
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to create expense, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL_PROD}/generate-download-url?file_name=${filename}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the signed URL");
      }
      const { download_url } = await response.json();

      console.log(response, download_url);
      if (typeof window !== "undefined") {
        window.open(download_url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error while viewing the file",
        variant: "destructive",
      });
      console.log("Error downloading file:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      toast({
        title: "Failed to upload file",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    uploadFile(`${vehicle.rc_url}`, e.target.files[0])
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

  console.log(document);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={false}>
      <DialogContent className="w-full">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-light-100 text-center">
            {`${type === "create" ? "Create" : "Edit"} Expense`}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Expense</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name for expense"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Expense</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expense type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ExpenseType.BATTERY}>
                          Battery Replace
                        </SelectItem>
                        <SelectItem value={ExpenseType.DAMAGE_REPAIR}>
                          Damage Repair
                        </SelectItem>
                        <SelectItem value={ExpenseType.DETAILING}>
                          Detailing
                        </SelectItem>
                        <SelectItem value={ExpenseType.FITNESS_RENEWAL}>
                          Fitness Renewal
                        </SelectItem>
                        <SelectItem value={ExpenseType.FUEL}>
                          Refueling
                        </SelectItem>
                        <SelectItem value={ExpenseType.GENERAL_REPAIR}>
                          General Repair
                        </SelectItem>
                        <SelectItem value={ExpenseType.INSURANCE_RENEWAL}>
                          Insurance Renewal
                        </SelectItem>
                        <SelectItem value={ExpenseType.PAID_SERVICE}>
                          Paid Service
                        </SelectItem>
                        <SelectItem value={ExpenseType.PUC_RENEWAL}>
                          PUC Renewal
                        </SelectItem>
                        <SelectItem value={ExpenseType.TYRE}>
                          Typre Repair
                        </SelectItem>
                        <SelectItem value={ExpenseType.WASHING}>
                          Washing
                        </SelectItem>
                        <SelectItem value={ExpenseType.OTHERS}>
                          Other expense
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Expense</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a description for the expense"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount of Expense (₹)</FormLabel>
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
                        let value = e.target.value.replace(/₹|,/g, ""); // Remove ₹ and commas
                        if (value === "" || isNaN(Number(value))) {
                          field.onChange(""); // Allow empty input instead of NaN
                        } else {
                          field.onChange(Number(value));
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Expense</FormLabel>
                  <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
                    <PopoverTrigger className="w-full" asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick expense date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      style={{ zIndex: 99999 }}
                      forceMount
                    >
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

            {expense ? (
              <div className="flex justify-between items-center px-2 border rounded-md gap-4 bg-white">
                <div>Document</div>
                <div className="flex justify-between">
                  <Button
                    onClick={() => downloadFile(expense.file_url)}
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
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Upload Document
                </FormLabel>
                <div className="flex items-center justify-between gap-2">
                  <Input
                    id="doc-upload"
                    className="hidden"
                    type="file"
                    ref={inputRef}
                    onChange={(e) => {
                      setDocument(e.target.files ? e.target.files[0] : null);
                    }}
                  />
                  <label
                    htmlFor="doc-upload"
                    className="rounded-md border px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer"
                  >
                    {document ? (
                      `${document.name}`
                    ) : (
                      <div className="w-full flex items-center justify-between gap-2">
                        Click here to upload <Upload />
                      </div>
                    )}
                  </label>
                  {document && (
                    <Trash2
                      className="cursor-pointer"
                      onClick={() => {
                        setDocument(null);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col gap-3 md:flex-row">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-cancel-button"
              >
                Cancel
              </Button>
              <Button className="modal-submit-button">
                Submit
                {(isPending || isUpdatingExpense) && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    height={24}
                    width={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
