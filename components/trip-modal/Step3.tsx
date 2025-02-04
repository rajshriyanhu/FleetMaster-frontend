import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { UseFormReturn } from "react-hook-form";
import { tripFormType } from "./TripModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TripStatus } from "@/dto";

const Step3 = ({
  errorMessage,
  form,
  onSubmit,
  setModalStep,
  isUpdatingLoading,
  isLoading,
}: {
  errorMessage: string;
  form: UseFormReturn<tripFormType>;
  onSubmit: (values: tripFormType) => Promise<void>;
  isUpdatingLoading: boolean;
  isLoading: boolean;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <DialogContent className="w-full">
    <DialogHeader className="flex flex-col gap-3">
      <DialogTitle className="text-light-100 text-center">
        Create Trip
      </DialogTitle>
    </DialogHeader>

    <FormField
      control={form.control}
      name="start_location"
      render={({ field }) => (
        <FormItem>
          <div className="shad-form-item">
            <FormLabel className="shad-form-label">Start Location</FormLabel>
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
      name="destination"
      render={({ field }) => (
        <FormItem>
          <div className="shad-form-item">
            <FormLabel className="shad-form-label">Destination</FormLabel>
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
      name="capacity"
      render={({ field }) => (
        <FormItem>
          <div className="shad-form-item">
            <FormLabel className="shad-form-label">
              Seating Capacity Requirements
            </FormLabel>
            <FormControl>
              <Input
                placeholder="How many seats "
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
      name="price"
      render={({ field }) => (
        <FormItem>
          <div className="shad-form-item">
            <FormLabel className="shad-form-label">Price of Trip</FormLabel>
            <FormControl>
              <Input
                placeholder="3000"
                className="shad-input"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value ? Number(e.target.value) : "");
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
      name="status"
      render={({ field }) => (
        <FormItem>
          <div className="shad-form-item">
            <FormLabel className="shad-form-label">
              Current Trip Status
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currnt Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TripStatus.NOT_STARTED}>
                    Not Started
                  </SelectItem>
                  <SelectItem value={TripStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TripStatus.COMPLETED}>
                    Completed
                  </SelectItem>
                  <SelectItem value={TripStatus.CANCELLED}>
                    Cancelled
                  </SelectItem>
                  <SelectItem value={TripStatus.EXPIRED}>Expired</SelectItem>
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
      name="start_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="shad-form-item">
            <FormLabel className="shad-form-label">
              Starting Date of trip
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
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
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            <Popover>
              <PopoverTrigger asChild>
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
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage className="shad-form-message" />
        </FormItem>
      )}
    />

    <DialogFooter className="flex gap-3">
      <Button
        type="button"
        onClick={() => setModalStep(2)}
        className="modal-cancel-button"
      >
        Back
      </Button>
      <Button
        type="button"
        onClick={() => form.handleSubmit(onSubmit)()}
        className="modal-submit-button"
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
    </DialogFooter>
    {errorMessage && <p className="error-message">*{errorMessage}</p>}
  </DialogContent>
);

export default Step3;
