export type User = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  permissions: {
    vehicle: {
      read: boolean;
      write: boolean;
    };
    trip: {
      read: boolean;
      write: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type Vehicle = {
  asset_no: number;
  capacity: number;
  chassis_no: string;
  color: string;
  created_at: string;
  deleted: boolean;
  engine_no: string;
  fitness_url: string;
  fitness_validity: string;
  fuel_type: string;
  id: string;
  insurance_url: string;
  insurance_validity: string;
  last_battery_change: string;
  last_service: string;
  last_service_kms: number;
  city: string;
  km_run: number;
  manufacturing_date: string;
  registration_date: string;
  model: string;
  next_service_due: string;
  next_service_due_kms: number;
  puc_url: string;
  rc_url: string;
  puc_validity: string;
  region: string;
  registration_no: string;
  state: string;
  transmission_type: string;
  updated_at: string;
  gps_renewal_due: string;
  variant: string;
  make: string;
};

export enum ExpenseType {
  PAID_SERVICE = "PAID_SERVICE",
  GENERAL_REPAIR = "GENERAL_REPAIR",
  DAMAGE_REPAIR = "DAMAGE_REPAIR",
  INSURANCE_RENEWAL = "INSURANCE_RENEWAL",
  PUC_RENEWAL = "PUC_RENEWAL",
  FITNESS_RENEWAL = "FITNESS_RENEWAL",
  FUEL = "FUEL",
  TYRE = "TYRE",
  BATTERY = "BATTERY",
  WASHING = "WASHING",
  DETAILING = "DETAILING",
  OTHERS = "OTHERS",
}

export type Expense = {
  id: string;
  name: string;
  description: string;
  vehicle_id: string;
  chassis_no: string;
  amount: number;
  type: string;
  date: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
};

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
};

export type Customer = {
  id: string;
  prefix: string;
  name: string;
  email: string;
  phone_number: string;
  address: Address;
  address_id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
};

export type Driver = {
  id: string;
  name: string;
  email: string;
  phone_number: number;
  alt_phone_number: number;
  emg_phone_number: number;
  insurance_valid_upto: string;
  joining_date: string;
  exit_date: string;
  employment_status: string;
  dl_number: string;
  experience: number;
  expertise: string;
  address: Address;
  address_id: string;
  working_region: string;
  working_state: string;
  working_city: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
};

export type Trip = {
  id: string;
  trip_type: string;
  vehicle: Vehicle;
  driver: Driver;
  customer_name: string;
  customer_number: string;
  start_date: string;
  end_date: string;
  days: number;
  start_location: string;
  end_location: string;
  location_visited: string;
  start_km: number;
  end_km: number;
  total_km: number;
  total_fuel_cost: number;
  average_fuel_cost: number;
  vehicle_average: number;
  state_tax: number;
  toll_tax: number;
  permit: number;
  maintainance: number;
  profit: number;
  created_at: string;
  updated_at: string;
  deleted: boolean;
};
