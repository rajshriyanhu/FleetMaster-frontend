import { vehicleFormType } from "@/components/VehicleForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type UpdateVehicleParams = {
  id: string;
  values: vehicleFormType;
};

export const useCreateVehicle = () => {
  return useMutation({
    mutationFn: async (values: vehicleFormType) => {
      const response = await axios.post("/vehicle/create", values);
      return response.data;
    },
  });
};

export function useGetAllVehicles() {
  return useQuery({
    queryKey: ["allVehicles"],
    queryFn: async () => {
      const response = await axios.get("/vehicle/");
      return response.data;
    },
  });
}

export function useGetVehicleById(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await axios.get(`/vehicle/${id}`);
      return response.data;
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({id, values} : UpdateVehicleParams) => {
      const response = await axios.put(`/vehicle/${id}`, values);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
    },
  });
}

export function useDeleteVehicle(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/vehicle/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
    },
  });
}
