"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import UserContext from "@/context/user-context";
import { setStoredUser } from "@/utils";

const signUpFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string(),
  code: z.number().min(100000).max(999999),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const { mutateAsync: signup } = useSignUp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useSearchParams();
  const inviteId = params.get("inviteId");
  const email = params.get("email");
  const name = params.get("name");

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: name ? name : "",
      email: email ? email : "",
      password: "",
      code: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    if (!inviteId) {
      return setErrorMessage("Invite ID is required");
    }
    const request = {
      name: values.name,
      email: values.email,
      password: values.password,
      code: values.code,
      inviteId: inviteId,
    };
    signup(request)
      .then((res) => {
        console.log(res);
        setStoredUser(res);
        toast({
          title: "Signup Successful!",
          description:
            "Wait till the administrator give you read and write access",
        });
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Login Failed!",
          description: "Please try again later.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto space-y-8 p-8 rounded-xl bg-white shadow-lg"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to complete registration
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="h-11 bg-gray-50/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="h-11 bg-gray-50/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      className="h-11 bg-gray-50/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      className="h-11 bg-gray-50/50"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isLoading}
            className="w-full h-11 text-base font-medium bg-brand hover:bg-brand/90"
            type="submit"
          >
            {isLoading ? (
              <>
                <span>Creating account</span>
                <img
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  className="ml-2 h-4 w-4 animate-spin"
                />
              </>
            ) : (
              "Create account"
            )}
          </Button>

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">*{errorMessage}</p>
          )}

          <div className="text-sm text-center text-muted-foreground">
            <span>Already have an account? </span>
            <Link
              className="font-medium text-brand hover:underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
