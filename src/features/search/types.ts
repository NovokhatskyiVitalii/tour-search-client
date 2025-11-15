export type GeoOptionType = "country" | "city" | "hotel";

export type Country = {
  id: string;
  name: string;
  flag: string;
};

export type City = {
  id: number;
  name: string;
};

export type Hotel = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
};

export type GeoEntity =
  | (Country & { type: "country" })
  | (City & { type: "city"; countryId?: string })
  | (Hotel & { type: "hotel" });

export type CountriesMap = Record<string, Country>;
export type GeoResponseMap = Record<string, GeoEntity>;

export type SearchOption = {
  id: string;
  label: string;
  type: GeoOptionType;
  subtitle?: string;
  flag?: string;
  countryId?: string;
  original: GeoEntity;
};

export type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

export type Selection = {
  id: string;
  label: string;
  type: GeoOptionType;
  countryId?: string;
  entity: GeoEntity;
};

export type HotelServices = {
  wifi?: "yes" | "no" | "none";
  aquapark?: "yes" | "no" | "none";
  tennis_court?: "yes" | "no" | "none";
  laundry?: "yes" | "no" | "none";
  parking?: "yes" | "no" | "none";
};

export type HotelDetails = Hotel & {
  description?: string;
  services?: HotelServices;
};
