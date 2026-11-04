import type { RentalPeriodType } from "../types/carCatalog";

interface CarPriceData {
  price_per_day?: number;
  price_per_day_after_discount?: number;
  price_per_week?: number;
  price_per_week_after_discount?: number;
  price_per_month?: number;
  price_per_month_after_discount?: number;
  periods?: { type: string; days: number; price: number; discount: number | null }[];
}

export function getCarDetailPrice(data: CarPriceData, type: RentalPeriodType): number | undefined {
  const prices = {
    daily: [data.price_per_day_after_discount, data.price_per_day],
    weekly: [data.price_per_week_after_discount, data.price_per_week],
    monthly: [data.price_per_month_after_discount, data.price_per_month],
  };
  const [discounted, original] = prices[type];
  if (discounted != null) return discounted;
  const period = data.periods?.filter((period) => period.days > 0 && (
    period.type === type || (type === "weekly" && period.type === "daily" && period.days === 7)
  )).sort((a, b) => a.days - b.days || a.price - b.price)[0];
  if (period) return Math.max(0, period.price - (period.discount ?? 0));
  return original;
}

export function getCarDetailOriginalPrice(data: CarPriceData, type: RentalPeriodType): number | undefined {
  const original = { daily: data.price_per_day, weekly: data.price_per_week, monthly: data.price_per_month }[type];
  if (original != null) return original;
  return getCarDetailPrice({
    periods: data.periods?.map((period) => ({ ...period, discount: 0 })),
  }, type);
}
