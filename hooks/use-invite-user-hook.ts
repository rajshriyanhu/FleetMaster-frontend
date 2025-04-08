import { InviteFormValues } from "@/components/user-invite-modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

export const useGetAllInvites = () => {
  return useQuery({
    queryKey: ["allInvites"],
    queryFn: async () => {
      const response = await axios.get('/invite');
      return response.data;
    },
  });
}

export const useInviteUser = () => {
    // const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (values: InviteFormValues) => {
        const response = await axios.post("/invite", values);
        return response.data;
      },
  
    });
  };