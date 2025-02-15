import { Bike, Car, FormInputIcon, Logs, LucideIcon, SquareUser, User, Users } from "lucide-react";

type NavItem = {
  name: string;
  icon: LucideIcon; // Specify that `icon` is a React component
  url: string;
};

export const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: Logs,
    url: "/",
  },
  {
    name: "Vehicles",
    icon: Car,
    url: "/vehicle",
  },
  {
    name: "Trips",
    icon: Bike,
    url: "/trip",
  },
  {
    name: "Customers",
    icon: Users,
    url: "/customers?page=1&limit=10",
  },
  {
    name: "Drivers",
    icon: SquareUser,
    url: "/drivers?page=1&limit=10",
  },
  {
    name: "Forms",
    icon: FormInputIcon,
    url: "/forms?tab=quotation",
  },
  {
    name: "All Users",
    icon: User,
    url: "/users",
  },
];

export const FormCategories = [
  {
    name: "Quotation",
    subcategories: ["Outstation", "Lumpsum", "Local"],
  },
  {
    name: "Booking Confirmation",
    subcategories: ["Outstation", "Lumpsum", "Local"],
  },
  {
    name: "Billing",
    subcategories: ["Outstation", "Lumpsum", "Local"],
  },
];


export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];
