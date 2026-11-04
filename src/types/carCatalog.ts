import type { Brand, CarCategory, Office } from "./api";

export type RentalPeriodType = "daily" | "weekly" | "monthly";

export interface CatalogPeriod {
  id: number;
  category_id: number;
  image: string;
  label: string;
  days: number;
  type: string;
  price: number;
  discount: number | null;
}

export interface CatalogCarDetail {
  id: number;
  car_id: number;
  rental_company_id: number;
  price_per_day: number;
  discount: number | null;
  is_featured: number | boolean;
  status: string;
  office: Pick<Office, "id" | "name" | "image_url"> & Partial<Office> & {
    city?: string;
    district?: string;
  };
  periods: CatalogPeriod[];
}

export interface CatalogCar {
  id: number;
  name: string;
  minimum_days: number;
  model_year: string;
  image_url: string;
  brand: Brand;
  car_category: CarCategory;
  details: CatalogCarDetail[];
}

export interface CarCatalogCategory {
  id: number;
  name: string;
  image_url: string;
  status: string;
  cars: CatalogCar[];
}

export interface CarCatalogResponse {
  data: CarCatalogCategory[];
}
