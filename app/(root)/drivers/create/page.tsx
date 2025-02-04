import DriverForm from "@/components/DriverForm";

const CreateDriverPage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter Driver Details
      </h2>
      <DriverForm />
    </div>
  );
};

export default CreateDriverPage;
