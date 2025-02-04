import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import TanstackProvider from "@/providers/tanstack-provider";
import "./globals.css";
import UserContext from "@/providers/user-provider";
import { useGetLoggedInUser } from "@/hooks/use-auth-hook";
import UserProvider from "@/providers/user-provider";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Vehicle Management Services",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <TanstackProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </TanstackProvider>
        <Toaster />
      </body>
    </html>
  );
}
