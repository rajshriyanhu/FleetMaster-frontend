"use client";

import { useParams } from "next/navigation";
import { useDeleteDriver, useGetDriverById } from "@/hooks/use-driver-hook";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Driver } from "@/dto";
import { useHeader } from "@/hooks/use-header";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { downloadFile } from "@/hooks/use-fle-donwload";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { SkeletonCard } from "@/components/skeleton-card";
import { useUserRole } from "@/hooks/use-get-role";
import { hasPermission } from "@/utils/permissions";

export default function DriverDetailPage() {
  const { driverId } = useParams();
  const { data, isLoading } = useGetDriverById(driverId as string);
  const {mutateAsync : deleteDriver} = useDeleteDriver();
  const { setTitle } = useHeader();
  const router = useRouter();
  const {toast} = useToast();
  const role = useUserRole();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/drivers">
            <BreadcrumbItem>Drivers</BreadcrumbItem>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Driver Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  if (isLoading) {
    return <div className="grid grid-cols-2 gap-4 pt-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>;
  }

  if (!data) {
    return <div>Driver not found</div>;
  }

  const driver: Driver = data.driver;

  const handleDeleteDriver = () => {
    // TODO: Implement delete driver logic
    deleteDriver(driver.id).then(() => {
      toast({
        title: "Driver deleted successfully",
        description: "The driver has been deleted.",
      });
    })
    .catch(() => {
     toast({
       variant: "destructive",
       title: "Error deleting driver",
       description: "Something went wrong while deleting the driver.",
     });
    })
    router.push(`/drivers`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        {role && hasPermission('drivers', 'edit', role) && <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push(`/drivers/${driver.id}/edit`)
          }
          >
            <Pencil1Icon className="h-4 w-4" /> Edit
          </Button>}

          {role && hasPermission('drivers', 'delete', role) && <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDeleteDriver}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{driver.name}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </h3>
              <p>{driver.email}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>
              <p>Primary: {driver.phone_number}</p>
              <p>Alternative: {driver.alt_phone_number}</p>
              <p>Emergency: {driver.emg_phone_number}</p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">DL Number</h3>
              <p>{driver.dl_number}</p>
            </div>
            <div>
              <h3 className="font-semibold">Experience</h3>
              <p>{driver.experience} years</p>
            </div>
            <div>
              <h3 className="font-semibold">Expertise</h3>
              <p>{driver.expertise}</p>
            </div>
            <div>
              <h3 className="font-semibold">Employment Status</h3>
              <p>{driver.employment_status}</p>
            </div>
            <div>
              <h3>Employee Document</h3>
              <Button onClick={() => downloadFile(driver.document_url)}>View Document</Button>
            </div>
          </CardContent>
        </Card>

        {/* Dates & Insurance */}
        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Joining Date</h3>
              <p>{format(new Date(driver.joining_date), "PPP")}</p>
            </div>
            {driver.exit_date && (
              <div>
                <h3 className="font-semibold">Exit Date</h3>
                <p>{format(new Date(driver.exit_date), "PPP")}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Insurance Valid Until</h3>
              <p>{format(new Date(driver.insurance_valid_upto), "PPP")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Address */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Working Location</h3>
              <p>Region: {driver.working_region}</p>
              <p>State: {driver.working_state}</p>
              <p>City: {driver.working_city}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold">Permanent Address</h3>
              <p>{driver.address.street}</p>
              <p>
                {driver.address.city}, {driver.address.state}
              </p>
              <p>
                {driver.address.country} - {driver.address.postal_code}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
