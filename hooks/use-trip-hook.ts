import { TripFormSchema } from "@/components/TripForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "./use-debounce";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type UpdateTripParams = {
  id: string;
  values: TripFormSchema;
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TripFormSchema) => {
      const { vehicle_model, ...submitValues } = values;
      const response = await axios.post("/trip/create", submitValues);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTrips"] });
    }
  });
};

export function useGetAllTrips(page:number, limit:number,searchQuery:string, sortBy:string) {
  const debouncedSearchQuery = useDebounce(searchQuery, 300); 
  return useQuery({
    queryKey: ["allTrips"],
    queryFn: async () => {
      const response = await axios.get(`/trip?page=${page}&limit=${limit}&search=${debouncedSearchQuery}&sortBy=${sortBy}`);
      return response.data;
    },
  });
}

export function useGetTripById(id: string) {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      const response = await axios.get(`/trip/${id}`);
      return response.data;
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: UpdateTripParams) => {
      const { vehicle_model, ...submitValues } = values;
      const response = await axios.put(`/trip/${id}`, submitValues);
      return response.data;
    },
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["trip", variables.id] });
      },
  });
}

export function useDeleteTrip(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/trip/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
    },
  });
}

