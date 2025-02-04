import { TripFormSchema } from "@/components/TripForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
      const response = await axios.post("/trip/create", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTrips"] });
    }
  });
};

export function useGetAllTrips() {
  return useQuery({
    queryKey: ["allTrips"],
    queryFn: async () => {
      const response = await axios.get("/trip/");
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
      const response = await axios.put(`/trip/${id}`, values);
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

