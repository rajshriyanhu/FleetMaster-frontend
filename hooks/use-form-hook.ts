import { LocalBillingFormSchema } from "@/components/forms/LocalBillingForm";
import { LocalBookingFormSchema } from "@/components/forms/LocalBookingForm";
import { LocalQuotationFormSchema } from "@/components/forms/LocalQuotationForm";
import { LumpsumBillingFormSchema } from "@/components/forms/LumpsumBillingForm";
import { LumpsumBookingFormSchema } from "@/components/forms/LumpsumBookingForm";
import { LumpsumQuotationFormSchema } from "@/components/forms/LumpsumQuotationForm";
import { OutstationBookingFormSchema } from "@/components/forms/OutstationBookingForm";
import { OutstationQuotationFormSchema } from "@/components/forms/OutstationQuotationForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

export const useLocalQuotationImage = () => {
  return useMutation({
    mutationFn: async (values: LocalQuotationFormSchema) => {
      const response = await axios.post("/form/localquotation", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};


export const useLocalBookingImage = () => {
  return useMutation({
    mutationFn: async (values: LocalBookingFormSchema) => {
      const response = await axios.post("/form/localbooking", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};


export const useLocalBillingImage = () => {
  return useMutation({
    mutationFn: async (values: LocalBillingFormSchema) => {
      const response = await axios.post("/form/localbilling", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};

export const useOutstationQuotationImage = () => {
  return useMutation({
    mutationFn: async (values: OutstationQuotationFormSchema) => {
      const response = await axios.post("/form/outstationquotation", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};


export const useoutstationBookingImage = () => {
  return useMutation({
    mutationFn: async (values: OutstationBookingFormSchema) => {
      const response = await axios.post("/form/outstationbooking", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};

export const useOutstationBillingImage = () => {
  return useMutation({
    mutationFn: async (values: OutstationBookingFormSchema) => {
      const response = await axios.post("/form/outstationbilling", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};


export const useLumpsumQuotationImage = () => {
  return useMutation({
    mutationFn: async (values: LumpsumQuotationFormSchema) => {
      const response = await axios.post("/form/lumpsumquotation", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};


export const useLumpsumBookingImage = () => {
  return useMutation({
    mutationFn: async (values: LumpsumBookingFormSchema) => {
      const response = await axios.post("/form/lumpsumbooking", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};

export const useLumpsumBillingImage = () => {
  return useMutation({
    mutationFn: async (values: LumpsumBillingFormSchema) => {
      const response = await axios.post("/form/lumpsumbilling", values, {
        responseType: "blob",
      });
      return response.data;
    },
  });
};