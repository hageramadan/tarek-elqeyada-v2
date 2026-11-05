import { getCarDetailPrice, getCarDetailOriginalPrice } from "@/src/utils/carDetailsPrices";
import type { CarDetailsResponse } from "@/src/types/api";
import type { RentalPeriodType } from "@/src/types/carCatalog";

export function mapCarBookingDetails(carData: CarDetailsResponse, type: RentalPeriodType, officeId: number | null) {
  const dailyPrice = getCarDetailPrice(carData, 'daily') ?? 0;
  const weeklyPrice = getCarDetailPrice(carData, 'weekly');
  const monthlyPrice = getCarDetailPrice(carData, 'monthly') ?? 0;
  const car = {
    id: carData.id,
    name: carData.name,
    brand: carData.brand?.name || '',
    brandLogo: carData.brand?.image_url || '',
    year: carData.model_year,
    pricePerDay: type === 'weekly' ? weeklyPrice! / 7 : dailyPrice,
    pricePerWeek: weeklyPrice,
    pricePerMonth: monthlyPrice,
    originalRentalPrice: getCarDetailOriginalPrice(carData, type),
    pricePerDayAfterDiscount: type === 'weekly' ? weeklyPrice! / 7 : dailyPrice,
    discount: carData.discount || 0,
    image: carData.image_url || '',
    image_url: carData.image_url || '',
    category: carData.brand?.name || '',
    categoryId: carData.brand?.id,
    minimumDays: carData.minimum_days || 3,
    isFeatured: carData.is_featured === 1,
    status: carData.status,
    providerId: carData.office?.id || officeId,
    providerName: carData.office?.name,
    providerImage: carData.office?.image_url,
    acceptanceRate: carData.office?.acceptance_rate,
    customerSatisfactionRate: carData.office?.customer_satisfaction_rate,
    deliverySpeedRate: carData.office?.delivery_speed_rate,
    guarantees: carData.guarantees || [],
    cancellationPolicies: carData.cancellation_policies || [],
    periods: carData.periods || [],
    additionalServices: carData.office?.additional_services || [],
    icons: carData.office?.icons?.map((icon) => ({
      id: icon.id,
      title: icon.title,
      image: icon.icon || icon.image,
    })) || [],
    averageRating: carData.office?.average_rating || 0,
    countReviews: carData.office?.count_reviews || 0,
    transmission: carData.transmission || 'أوتوماتيك',
    fuelType: carData.fuel_type || 'بنزين',
    seats: carData.seats || 5,
    doors: carData.doors || 4,
    luggage: carData.luggage || 3,
  };

  const services = carData.office?.additional_services?.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    periodType: service.period_type,
    pricePerDay: service.price_per_day,
    isAvailable: service.status === 'active',
    imageUrl: service.image_url,
  })) || [];

  const bookingPeriods = carData.periods?.map((period) => ({
    id: period.id,
    label: period.label,
    days: period.days || period.days_count || 30,
    days_count: period.days_count || period.days || 30,
    type: period.type,
    price: period.price || period.price_total || 0,
    discount: period.discount || 0,
  })) || [];

  return { car, services, bookingPeriods };
}
