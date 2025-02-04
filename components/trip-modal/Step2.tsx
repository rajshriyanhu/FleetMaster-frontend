import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { tripFormType } from "./TripModal";
import { useGetAllDrivers } from "@/hooks/use-driver-hook";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Driver } from "@/dto";

const Step2 = ({
  form,
  setModalStep,
}: {
  form: UseFormReturn<tripFormType>;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const {data, isError} = useGetAllDrivers();
  return (
  <DialogContent className="w-full">
    <DialogHeader className="flex flex-col gap-3">
      <DialogTitle className="text-light-100 text-center">
        Select Driver
      </DialogTitle>
    </DialogHeader>
    {data && !isError && (
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.drivers.map((driver: Driver) => {
                      return (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
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
      )}
    <DialogFooter className="flex gap-2">
      <Button
        type="button"
        onClick={() => setModalStep(1)}
        className="modal-cancel-button"
      >
        Back
      </Button>
      <Button
        type="button"
        onClick={() => {
          setModalStep(3);
        }}
        className="modal-submit-button"
      >
        Next
      </Button>
    </DialogFooter>
  </DialogContent>
)};

export default Step2;
