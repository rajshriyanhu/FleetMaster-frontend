export const packageOptions = {
    "06 Hrs or 60 Kms": { time_limit: "6 Hrs", km_limit: "60 Kms" },
    "12 Hrs or 150 Kms": { time_limit: "12 Hrs", km_limit: "150 Kms" },
    "24 Hrs or 300 Kms": { time_limit: "24 Hrs", km_limit: "300 Kms" },
};

export const passengerCapacity = [
    "Driver + 4",
    "Driver + 6",
    "Driver + 7",
    "Driver + 19",
];

export const vehicle = [
    "WagonR",
    "Dzire",
    "Ertiga",
    "Crysta",
    "Traveller",
];

// Type the cost maps
export const costExtraHrMap: Record<string, number> = {
    WagonR: 187,
    Dzire: 208,
    Ertiga: 229,
    Crysta: 291,
    Traveller: 363,
  };

export const costExtraKmMap: Record<string, number> = {
    WagonR: 15,
    Dzire: 16,
    Ertiga: 18,
    Crysta: 23,
    Traveller: 29,
  };
export const costExtraHr = [187, 208, 229, 291, 363];

export const costExtraKm = [15, 16, 18, 23, 29];

export const estimatedCost = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 11000, 12000]

export const timeMap: Record<string, string> = {
    "06 Hrs or 60 Kms": '6',
    "12 Hrs or 150 Kms": '12',
    "24 Hrs or 300 Kms": '24',
};
export const kmMap: Record<string, string> = {
    "06 Hrs or 60 Kms": '60',
    "12 Hrs or 150 Kms": '150',
    "24 Hrs or 300 Kms": '300',
};