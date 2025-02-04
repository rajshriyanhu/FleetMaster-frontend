import VehicleForm from "@/components/VehicleForm";

const UploadVehiclePage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter your vehicle details
      </h2>
      <VehicleForm />
    </div>
  );
};

export default UploadVehiclePage;
