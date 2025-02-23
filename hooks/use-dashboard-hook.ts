import { useQuery } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

export function useGetDashboardTrips() {
    return useQuery({
      queryKey: ["dashboardtrips"],
      queryFn: async () => {
        const response = await axios.get('/dashboard/trips');
        return response.data;
      },
    });
  }


  export function useGetDashboardTasks() {
    return useQuery({
      queryKey: ["dashboardtasks"],
      queryFn: async () => {
        const response = await axios.get('/dashboard/tasks');
        return response.data;
      },
    });
  }