import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand-100 p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <div className="flex gap-4 items-center">
            <Image
              src="/fleetmaster-logo.png"
              alt="logo"
              width={82}
              height={82}
              className="h-auto rounded-md"
            />
            <div className="text-5xl font-bold text-brand">FleetMaster</div>
          </div>

          <div className="space-y-5 text-brand">
            <h1 className="h1 italic">Revolutionizing Fleet Management</h1>
            <p className="body-1">
              CRFMS (Car Rental Fleet Management Software)
            </p>
          </div>
          <Image
            src="/trip1.png"
            alt="trips"
            width={342}
            height={342}
            className="rounded-lg transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-gray-100 p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/fleetmaster-logo.png"
            alt="logo"
            width={82}
            height={82}
            className="h-auto rounded-md"
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
