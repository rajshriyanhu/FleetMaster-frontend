import { SignUpFormSchema } from "@/components/SignUpForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
axios.defaults.withCredentials = true;

type LoginSchema = {
  email: string;
  password: string;
}

type SignUpSchema = {
  email: string;
  password: string;
  name: string;
  code: number;
  inviteId: string; 
}

type AccessSchema = {
  userId: string,
  // permissions: {
  //   vehicle: {
  //     read: boolean;
  //     write: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   },
  //   trip: {
  //     read: boolean;
  //     write: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   },
  //   driver: {
  //     read: boolean;
  //     write: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   },
  //   customer: {
  //     read: boolean;
  //     write: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   },
  //   expense: {
  //     read: boolean;
  //     write: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   },
  //   user : {
  //     read: boolean;
  //     write: boolean;
  //     update: boolean;
  //     delete: boolean;
  //   }
  // }
  role: "ADMIN" | "EDITOR" | "VIEWER"
}

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SignUpSchema) => {
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
    staleTime: 1000 * 60 * 5, // 15 minutes
    refetchInterval: 1000 * 60 * 5,
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

export const useSendCode = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post("/auth/sendCode", {email});
      return response.data;
    },
  });
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await axios.post("/auth/updatePassword", {password});
      return response.data;
    },
  });
}