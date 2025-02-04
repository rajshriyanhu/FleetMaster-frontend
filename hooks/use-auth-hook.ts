import { SignUpFormSchema } from "@/components/SignUpForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type LoginSchema = {
  email: string;
  password: string;
}

type AccessSchema = {
  userId: string,
  permissions: {
    vehicle: {
      read: boolean;
      write: boolean;
    },
    trip: {
      read: boolean;
      write: boolean;
    }
  }
}

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SignUpFormSchema) => {
      const response = await axios.post("/auth/signup", values);
      return response.data;
    },

  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: LoginSchema) => {
      const response = await axios.post("/auth/login", values);
      return response.data;
    },

  });
};

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post("/auth/logout");
      return response.data;
    },

  });
}


export function useGetLoggedInUser() {
  return useQuery({
    queryKey: ["loggedInUser"],
    queryFn: async () => {
      const response = await axios.get(`/auth/loggedInUser`);
      return response.data;
    },
  });
}


export function useGetAllUsers() {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await axios.get('/auth/allUsers');
      return response.data;
    },
  });
}

export const useUpdateAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: AccessSchema) => {
      const response = await axios.post("/auth/access", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['allUsers']})
    }
  });
};