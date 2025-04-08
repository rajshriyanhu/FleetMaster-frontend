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
import { useState } from "react"
import Link from "next/link"
import { useSignIn } from "@/hooks/use-auth-hook";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { setStoredUser } from "@/utils";


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

    const formSchema = authFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            email: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage('')
        login(values)
            .then((res) => {
                console.log(res)
                toast({
                    title: "Login Successful!"
                })
                setStoredUser(res);
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-8 p-8 rounded-xl bg-white shadow-lg">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
                    </div>

                    <div className="space-y-4">
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
                                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password" 
                                            placeholder="Enter your password" 
                                            className="h-11 bg-gray-50/50" 
                                            {...field} 
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
                                <span>Signing in</span>
                                <img src="/assets/icons/loader.svg" alt="loader" className="ml-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>

                    {errorMessage && (
                        <p className="text-sm text-red-500 text-center">*{errorMessage}</p>
                    )}

                    <div className="text-sm text-center text-muted-foreground">
                        <span>Don't have an account? </span>
                        <Link 
                            className="font-medium text-brand hover:underline" 
                            href="/sign-up"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default SignInForm
