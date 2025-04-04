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
import { useRouter } from "next/navigation";
import { useSignUp } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import UserContext from "@/context/user-context";

const signUpFormSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2).max(50),
    password: z.string(),
})

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>

const SignUpForm = () => {
    const router = useRouter();
    const { mutateAsync: signup, } = useSignUp();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext is not available!");
    }

    const { setUser } = context;

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
        console.log(values)
        setIsLoading(true);
        setErrorMessage('')
        signup(values)
            .then((res) => {
                console.log(res)
                setUser(res)
                toast({
                    title: "Signup Successful!",
                    description: 'Wait till the administrator give you read and write access'
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
                    <h1>Sign Up</h1>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" className="shad-input" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />

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
                                        <Input placeholder="Enter password" className="shad-input" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isLoading} className="form-submit-button" type="submit">Sign Up
                        {isLoading && (
                            <img src='/assets/icons/loader.svg' alt='loader' height={24} width={24} className="ml-2 animate-spin" />
                        )}
                    </Button>

                    {errorMessage && (
                        <p className="error-message">*{errorMessage}</p>
                    )}

                    <div className="body-2 flex justify-center">
                        <p>Already have an account?</p>
                        <Link className="ml-1 font-medium text-brand" href="/sign-in">
                            Sign In
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default SignUpForm
