'use client';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useContext, useState } from "react"
import Link from "next/link"
import { useSignIn } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UserContext from "@/context/user-context";


const authFormSchema = () => {
    return z.object({
        email: z.string().email(),
        password: z.string()
    })
}

const SignInForm = () => {
    const router = useRouter();
    const { mutateAsync: login, } = useSignIn();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext is not available!");
  }

  const { setUser } = context;

    const formSchema = authFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            email: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        setIsLoading(true);
        setErrorMessage('')
        login(values)
            .then((res) => {
                console.log(res)
                setUser(res)
                toast({
                    title: "Login Successful!"
                })
                router.push('/')
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Login Failed!",
                    description: 'Please try again later.',
                    variant: 'destructive'
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                    <h1>Sign In</h1>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" className="shad-input" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Enter your password" className="shad-input" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isLoading} className="form-submit-button" type="submit">Sign In
                        {isLoading && (
                            <img src='/assets/icons/loader.svg' alt='loader' height={24} width={24} className="ml-2 animate-spin" />
                        )}
                    </Button>

                    {errorMessage && (
                        <p className="error-message">*{errorMessage}</p>
                    )}

                    <div className="body-2 flex justify-center">
                        <p>Don't have an account? </p>
                        <Link className="ml-1 font-medium text-brand" href="/sign-up">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default SignInForm
