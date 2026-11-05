"use client";
import { useState, useEffect } from "react";
import { CarService } from "@/src/services/carService";
import { getCarDetailPrice } from "@/src/utils/carDetailsPrices";
import type { CarDetailsResponse } from "@/src/types/api";
import type { RentalPeriodType } from "@/src/types/carCatalog";

export function useCarBookingDetails(carId: number, officeId: number | null, type: RentalPeriodType) {
  const [carData, setCarData] = useState<CarDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!officeId || isNaN(carId)) {
        setError('بيانات غير صحيحة');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        let data;
        if (type !== 'monthly') {

          data = await CarService.getDailyCarDetails(officeId, carId);
          if (type === 'weekly') {
            if (getCarDetailPrice(data, 'weekly') == null) {
              throw new Error('لا توجد فترة أسبوعية متاحة لهذه السيارة');
            }
          }
        } else {

          data = await CarService.getMonthlyCarDetails(officeId, carId);
        }
        setCarData(data);
      } catch {

        setError('حدث خطأ في تحميل تفاصيل السيارة');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId, officeId, type]);

  return { carData, loading, error };
}
