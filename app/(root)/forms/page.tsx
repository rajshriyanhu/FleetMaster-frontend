"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FormCategories } from "@/constants";
import LocalQuotationForm from "@/components/forms/LocalQuotationForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocalBookingForm from "@/components/forms/LocalBookingForm";
import LocalBillingForm from "@/components/forms/LocalBillingForm";
import OutstationQuotationForm from "@/components/forms/OutstationQuotationForm";
import LumpsumQuotationForm from "@/components/forms/LumpsumQuotationForm";
import OutstationBookingForm from "@/components/forms/OutstationBookingForm";
import LumpsumBookingForm from "@/components/forms/LumpsumBookingForm";
import OutstationBillingForm from "@/components/forms/OutstationBillingForm";
import LumpsumBillingForm from "@/components/forms/LumpsumBillingForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeader } from "@/hooks/use-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const FormPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Forms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, []);

  const setTab = (newTab : string) => {
    const params = new URLSearchParams(searchParams); 
    params.set("tab", newTab);

    router.push(`/forms?${params.toString()}`);
  };

  const renderForm = () => {
    if (tab === "quotation") {
      if (activeSubcategory === "local") {
        return <LocalQuotationForm />;
      }
      if(activeSubcategory === 'outstation'){
        return <OutstationQuotationForm />
      }
      if(activeSubcategory === 'lumpsum') {
        return <LumpsumQuotationForm />
      }
    }
    if(tab === 'booking confirmation'){
      if(activeSubcategory === 'local') {
        return <LocalBookingForm />
      }
      if(activeSubcategory === 'outstation'){
        return <OutstationBookingForm />
      }
      if(activeSubcategory === 'lumpsum') {
        return <LumpsumBookingForm />
      }
    }
    if(tab === 'billing'){
      if(activeSubcategory === 'local') {
        return <LocalBillingForm />
      }
      if(activeSubcategory === 'outstation'){
        return <OutstationBillingForm />
      }
      if(activeSubcategory === 'lumpsum') {
        return <LumpsumBillingForm />
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue={tab || 'quotation'} className="space-y-4">
        <TabsList>
          {FormCategories.map((category, index) => (
            <TabsTrigger
              key={index}
              value={category.name.toLowerCase()}
              onClick={() => setTab(category.name.toLowerCase())}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {FormCategories.map((category, index) => (
          <TabsContent key={index} value={category.name.toLowerCase()}>
            <Accordion type="single" collapsible className="w-full">
              {category.subcategories.map((sub, subIndex) => (
                <AccordionItem key={subIndex} value={sub.toLowerCase()}>
                  <AccordionTrigger
                    onClick={() => setActiveSubcategory(sub.toLowerCase())}
                  >
                    {sub}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea>
                      <div className="p-4 border rounded-md bg-gray-50">
                        {renderForm()}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FormPage;
