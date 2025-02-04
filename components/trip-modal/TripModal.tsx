"use client";

import { Dialog } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trip } from "@/dto";
import { useCreateTrip, useUpdateTrip } from "@/hooks/use-trip-hook";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const tripFormSchema = () => {
  return z.object({
    start_location: z.string().min(2).max(50),
    destination: z.string().min(2).max(50),
    capacity: z.string().min(1).max(50),
    start_date: z.date(),
    end_date: z.date(),
    status: z.enum([
      "NOT_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "EXPIRED",
    ]),
    price: z.number(),
    customer_id: z.string().min(2, "Customer id is reuired"),
    driver_id: z.string().min(2, "Driver id is reuired"),
  });
};

export type tripFormType = z.infer<ReturnType<typeof tripFormSchema>>;

const TripModal = ({
  trip,
  isModalOpen,
  setIsModalOpen,
}: {
  trip?: Trip;
  type: "create" | "edit";
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [modalStep, setModalStep] = useState(1);

  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: createTrip, isPending: isLoading } = useCreateTrip();
  const { mutateAsync: updateTrip, isPending: isUpdatingLoading } =
    useUpdateTrip();
  const { toast } = useToast();
  const formSchema = tripFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_location: "",
      capacity: "",
      destination: "",
      status: "IN_PROGRESS",
    },
  });

  useEffect(() => {
    if (!trip) return;
    form.setValue("capacity", trip.capacity);
    form.setValue("start_location", trip.start_location);
    form.setValue("destination", trip.destination);
    form.setValue("price", trip.price);
    form.setValue("customer_id", trip.customer.id);
    form.setValue("driver_id", trip.driver.id);
    form.setValue("start_date", new Date(trip.start_date));
    form.setValue("end_date", new Date(trip.end_date));
    form.setValue("status", trip.status);
  }, [trip]);

  console.log(form.formState.errors);

  const onSubmit = async (values: tripFormType) => {
    setErrorMessage("");
    console.log(values);
    if (trip) {
      updateTrip({ id: trip.id, values })
        .then(() => {
          toast({
            title: "Trip details saved successfully",
          });
          setIsModalOpen(false);
        })
        .catch((err) => {
          toast({
            title: "Uh Oh! Something went wrong",
            description: `Failed to update trip, ${err.message}`,
            variant: "destructive",
          });
        });
      return;
    }

    createTrip(values)
      .then(() => {
        toast({
          title: "Trip created successfully",
        });
        setIsModalOpen(false);
      })
      .catch((err) => {
        toast({
          title: "Uh Oh! Something went wrong",
          description: `Failed to create trip, ${err.message}`,
          variant: "destructive",
        });
      });
  };

  const renderDialogContent = () => {
    if (modalStep === 1)
      return (
        <Step1 form={form} setModalStep={setModalStep} setIsModalOpen={setIsModalOpen} />
      );
    if (modalStep === 2) return <Step2 form={form} setModalStep={setModalStep} />;
    if (modalStep === 3)
      return (
        <Step3
          errorMessage={errorMessage}
          isLoading={isLoading}
          isUpdatingLoading={isUpdatingLoading}
          form={form}
          onSubmit={onSubmit}
          setModalStep={setModalStep}
        />
      );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="trip-form">
          {renderDialogContent()}
        </form>
      </Form>
    </Dialog>
  );
};

export default TripModal;
