import { Vehicle } from "@/dto";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VehicleForm from "./VehicleForm";
import { ScrollArea } from "./ui/scroll-area";

const EditVehicleModal = ({
  vehicle,
  isModalOpen,
  setIsModalOpen,
}: {
  vehicle: Vehicle;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-full">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-light-100 text-center">
            Edit Vehicle Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh] w-full py-2">
          <VehicleForm vehicle={vehicle} setIsModalOpen={setIsModalOpen} />
        </ScrollArea>
        {/* <DialogFooter className="flex flex-col gap-3 md:flex-row">
          <Button
                type="button"
                onClick={() => {if(setIsModalOpen)setIsModalOpen(false)}}
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
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleModal;
