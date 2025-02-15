import { DriverFormType } from "@/components/DriverForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "./use-debounce";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type UpdateDriverParams = {
  id: string;
  values: DriverFormType;
}

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: DriverFormType) => {
      const response = await axios.post("/driver/create", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDriver"] });
    }
  });
};

export function useGetAllDrivers(page:number, limit:number,searchQuery:string, sortBy:string) {
  const debouncedSearchQuery = useDebounce(searchQuery, 300); 
  return useQuery({
    queryKey: ["allDriver", page, limit, debouncedSearchQuery, sortBy],
    queryFn: async () => {
      const response = await axios.get(`/driver?page=${page}&limit=${limit}&search=${debouncedSearchQuery}&sortBy=${sortBy}`);
      return response.data;
    },
  });
}

export function useGetDriverById(id: string) {
  return useQuery({
    queryKey: ["driver", id],
    queryFn: async () => {
      const response = await axios.get(`/driver/${id}`);
      return response.data;
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: UpdateDriverParams) => {
      const response = await axios.put(`/driver/${id}`, values);
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allDriver"] });
      },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/driver/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDriver"] });
    },
  });
}

