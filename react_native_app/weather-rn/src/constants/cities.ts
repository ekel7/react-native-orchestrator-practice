export const CITIES = [
  "Dhaka",
  "Barishal",
  "Chittagong",
  "Mymensingh",
  "Khulna",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
] as const;

export type CityName = (typeof CITIES)[number];
