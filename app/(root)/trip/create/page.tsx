import TripForm from "@/components/TripForm";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter Trip Details
      </h2>
      <TripForm />
    </div>
  );
};

export default Page;
