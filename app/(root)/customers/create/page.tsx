import CustomerForm from "@/components/CustomerForm";
import React from "react";

const CustomerPage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="h2 text-brand text-2xl font-semibold">
        Enter Customer Details
      </h2>
      <CustomerForm />
    </div>
  );
};

export default CustomerPage;
