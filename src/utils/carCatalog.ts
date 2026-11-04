import type { Car } from "../types/car";
import type { CarCatalogCategory, RentalPeriodType } from "../types/carCatalog";

export function filterCarCatalog(
  categories: CarCatalogCategory[],
  type: RentalPeriodType,
): { id: number; name: string; cars: Car[] }[] {
  return categories.filter((category) => category.status === "active").map((category) => ({
    id: category.id,
    name: category.name,
    cars: category.cars.flatMap((car) => car.details.flatMap((detail) => {
      if (detail.status !== "active" || detail.office.is_enabled === false) return [];

      // Some daily periods span a week; use the shortest matching rental period.
      const period = detail.periods
        .filter((period) => period.type === type && period.days > 0)
        .sort((a, b) => a.days - b.days || a.price - b.price)[0];
      if (!period) return [];

      const office = detail.office;
      const discount = period.discount ?? 0;
      return [{
        id: car.id,
        name: car.name,
        brand: car.brand?.name || "",
        brandLogo: car.brand?.image_url || "",
        model: car.brand?.name || "",
        year: car.model_year,
        pricePerDay: period.price,
        pricePerDayAfterDiscount: period.price * (1 - discount / 100),
        discount,
        image: car.image_url,
        category: category.name,
        categoryId: category.id,
        minimumDays: car.minimum_days,
        isFeatured: Boolean(detail.is_featured),
        status: detail.status,
        providerId: detail.rental_company_id,
        providerName: office.name,
        providerImage: office.image_url,
        acceptanceRate: office.acceptance_rate,
        customerSatisfactionRate: office.customer_satisfaction_rate,
        deliverySpeedRate: office.delivery_speed_rate,
        averageRating: office.average_rating,
        countReviews: office.count_reviews,
        quickPolicy: {
          pickupWithinHourText: office.quick_policy?.pickup_within_hour_text || "",
          deductibleText: office.quick_policy?.deductible_text || "",
          kmLimitText: office.quick_policy?.km_limit_text || "",
        },
        icons: office.icons?.map((icon) => ({
          id: icon.id,
          title: icon.title,
          image: icon.icon || icon.image,
        })) || [],
      }];
    })).reduce<Car[]>((offers, car) => {
      const index = offers.findIndex((offer) =>
        offer.id === car.id && offer.providerId === car.providerId,
      );
      if (index === -1) offers.push(car);
      else if (car.pricePerDayAfterDiscount < offers[index].pricePerDayAfterDiscount) {
        offers[index] = car;
      }
      return offers;
    }, []),
  })).filter((category) => category.cars.length > 0);
}
