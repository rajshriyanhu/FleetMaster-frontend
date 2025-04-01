import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/dto";
import { Button } from "./ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { TrashIcon } from "lucide-react";
import { useDeleteCustomer } from "@/hooks/use-customer-hook";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsDialog = ({ customer, isOpen, onClose }: CustomerDetailsDialogProps) => {
  const { mutateAsync : deleteCustomer } = useDeleteCustomer();
  const {toast} = useToast();
  const router = useRouter();

  if (!customer) return null;

  const handleEditCustomer = () => {
    // TODO: Implement edit customer logic
    router.push(`/customers/${customer.id}/edit`);
    onClose();
  };

  const handleDeleteCustomer = () => {
    deleteCustomer(customer.id).then(() => {
      toast({
        title: "Customer deleted successfully",
        description: "The customer has been deleted from the system.",
      });
      onClose();
    })
    .catch(() => {
      toast({
        variant: "destructive",
        title: "Customer deletion failed",
        description: "An error occurred while deleting the customer.",
      });
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Basic Information</h3>
            <div>
              <span className="text-muted-foreground">Name: </span>
              {customer.prefix} {customer.name}
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              {customer.email}
            </div>
            <div>
              <span className="text-muted-foreground">Phone: </span>
              {customer.phone_number}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Address</h3>
            <div>
              <span className="text-muted-foreground">Street: </span>
              {customer.address.street}
            </div>
            <div>
              <span className="text-muted-foreground">City: </span>
              {customer.address.city}
            </div>
            <div>
              <span className="text-muted-foreground">State: </span>
              {customer.address.state}
            </div>
            <div>
              <span className="text-muted-foreground">Postal Code: </span>
              {customer.address.postal_code}
            </div>
          </div>
        </div>
        <DialogFooter>
        <div className="flex items-center gap-3">
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleEditCustomer}
          >
            <Pencil1Icon className="h-4 w-4" /> Edit
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDeleteCustomer}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;