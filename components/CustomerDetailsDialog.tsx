import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/dto";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsDialog = ({ customer, isOpen, onClose }: CustomerDetailsDialogProps) => {
  if (!customer) return null;

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
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;