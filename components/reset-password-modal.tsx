import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { User } from "@/dto";
import { useUpdatePassword } from "@/hooks/use-auth-hook";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordModal({ user }: { user: User }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutateAsync: updatePassword } = useUpdatePassword();
  //   const { mutateAsync: sendCodeMutate } = useSendCode();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      //   code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    console.log(values.password);
    try {
      await updatePassword(values.password);
      toast({
        title: "Password reset successful",
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  //   const sendCode = () => {
  //     console.log(user.email)
  //     sendCodeMutate(user.email)
  //     .then(() => {
  //         toast({
  //             title: `An email has been sent to ${user.email}`,
  //             description: 'Also check your spam folder',
  //         })
  //     })
  //     .catch((err) => {
  //         toast({
  //             title: `Failed to send email to ${user.email}`,
  //             description: err.message,
  //             variant: 'destructive',
  //         })
  //     })
  //   }

  const password = form.watch("password");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li
                      className={
                        password.length >= 6
                          ? "text-emerald-500"
                          : "text-gray-500"
                      }
                    >
                      • At least 6 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password)
                          ? "text-emerald-500"
                          : "text-gray-500"
                      }
                    >
                      • One uppercase letter
                    </li>
                    <li
                      className={
                        /[a-z]/.test(password)
                          ? "text-emerald-500"
                          : "text-gray-500"
                      }
                    >
                      • One lowercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(password)
                          ? "text-emerald-500"
                          : "text-gray-500"
                      }
                    >
                      • One number
                    </li>
                    <li
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(password)
                          ? "text-emerald-500"
                          : "text-gray-500"
                      }
                    >
                      • One special character
                    </li>
                  </ul>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
