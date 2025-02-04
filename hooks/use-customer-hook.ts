import { CustomerFormType } from "@/components/CustomerForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type UpdateExpenseParams = {
  id: string;
  values: CustomerFormType;
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CustomerFormType) => {
      const response = await axios.post("/customer/create", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
    }
  });
};

export function useGetAllCustomers() {
  return useQuery({
    queryKey: ["allCustomer"],
    queryFn: async () => {
      const response = await axios.get(`/customer/`);
      return response.data;
    },
  });
}

// export function useGetExpenseById(id: string) {
//   return useQuery({
//     queryKey: ["expense", id],
//     queryFn: async () => {
//       const response = await axios.get(`/expense/${id}`);
//       return response.data;
//     },
//   });
// }

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: UpdateExpenseParams) => {
      const response = await axios.put(`/customer/${id}`, values);
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
      },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/customer/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
    },
  });
}

