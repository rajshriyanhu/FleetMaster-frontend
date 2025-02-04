import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

export type CreateExpenseRequest = {
    name: string;
    description: string;
    amount: number;
    type: string;
    date: Date;
    vehicle_id: string;
    chassis_no: string;
}

type UpdateExpenseParams = {
  id: string;
  values: CreateExpenseRequest;
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateExpenseRequest) => {
      const response = await axios.post("/expense/create", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpense"] });
    }
  });
};

export function useGetAllExpenses(vehicleId : string) {
  return useQuery({
    queryKey: ["allExpenses"],
    queryFn: async () => {
      const response = await axios.get(`/expense/${vehicleId}`);
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

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: UpdateExpenseParams) => {
      const response = await axios.put(`/expense/${id}`, values);
      return response.data;
    },
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["expense", variables.id] });
      },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/expense/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
}

