'use client';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { CarService } from '@/src/services/carService';
import { filterAvailableTimes } from '@/src/utils/bookingFormUtils';
import type { AvailableDate } from '@/src/types/api';
import type { AvailableMonth } from '@/src/utils/bookingUtils';
import type { BookingFormState } from '@/src/types/bookingForm';
import type { Dispatch, SetStateAction } from 'react';

type Options = Pick<BookingFormState, 'bookingData' | 'updateField' | 'setPeriodId' | 'setAvailableMonthsData'> & { carId: string; rentalCompanyId?: number; bookingType: 'daily' | 'monthly'; setRentalMonths: Dispatch<SetStateAction<number>> };

export function useBookingSchedule({
  carId,
  rentalCompanyId,
  bookingType,
  bookingData,
  updateField,
  setPeriodId,
  setAvailableMonthsData,
  setRentalMonths,
}: Options) {
  // Read current callbacks without fetching availability again when validation errors change.
  const latestBooking = useRef({
    bookingData,
    updateField,
    setPeriodId,
    setAvailableMonthsData,
  });
  latestBooking.current = {
    bookingData,
    updateField,
    setPeriodId,
    setAvailableMonthsData,
  };
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);

  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);

  const [availableDateList, setAvailableDateList] = useState<Date[]>([]);

  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);

  const [availableTimeList, setAvailableTimeList] = useState<string[]>([]);

  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);

  const [monthlyDateList, setMonthlyDateList] = useState<Date[]>([]);

  const [monthlyTimeList, setMonthlyTimeList] = useState<string[]>([]);

  const [selectedMonthlyDateIndex, setSelectedMonthlyDateIndex] =
    useState<number>(0);

  const [selectedMonthlyTimeIndex, setSelectedMonthlyTimeIndex] =
    useState<number>(0);

  useEffect(() => {
    const { updateField, setPeriodId, setAvailableMonthsData } = latestBooking.current;
    const fetchAllPeriods = async () => {
      try {
        setIsLoadingPeriods(true);
        const carIdNumber = parseInt(carId);
        const officeId = rentalCompanyId;

        if (!officeId) {

          setIsLoadingPeriods(false);
          return;
        }

        // 🔹 1️⃣ جلب فترات الحجز اليومي
        const dailyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "daily",
        );

        // تخزين بيانات اليومي
        setAvailableDates(dailyData.available_dates || []);

        const dailyDates = (dailyData.available_dates || [])
          .filter((d) => {
            if (!d.is_available) return false;
            // لازم يكون فيه وقت واحد على الأقل لسه متاح
            const validTimes = filterAvailableTimes(
              d.available_hours
                .filter((h) => h.is_available)
                .map((h) => h.time),
              d.date,
            );
            return validTimes.length > 0;
          })
          .map((d) => new Date(d.date));

        setAvailableDateList(dailyDates);

        // 🔹 2️⃣ جلب فترات الحجز الشهري
        const monthlyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "monthly",
        );

        // ✅ ابعت الأشهر للـ hook
        if (monthlyData?.available_months?.length) {
          setAvailableMonthsData(monthlyData.available_months);
        }

        // ========== معالجة الحجز الشهري ==========
        if (bookingType === "monthly") {
          setMonthlyDateList(dailyDates);

          if (
            monthlyData.available_months &&
            monthlyData.available_months.length > 0
          ) {
            const months = monthlyData.available_months.filter(
              (month: AvailableMonth) => month.is_available,
            );
            setAvailableMonths(months);

            // اختيار أول شهر وفترة متاحة
            if (months.length > 0 && months[0].available_periods.length > 0) {
              const firstPeriod = months[0].available_periods[0];
              setPeriodId(firstPeriod.id);
              updateField("rentalDays", firstPeriod.days_count);

              const monthsCount = Math.max(
                1,
                Math.round(firstPeriod.days_count / 30),
              );
              setRentalMonths(monthsCount);
            }
          } else {

            setPeriodId(0);
          }

          // اختيار أول تاريخ تلقائيًا
          if (dailyDates.length > 0) {
            const firstDate = dailyDates[0];
            const firstDateStr = format(firstDate, "yyyy-MM-dd");

            updateField("rentalDate", firstDateStr);

            const dailyDate = (dailyData.available_dates || []).find(
              (date) => date.date === firstDateStr,
            );

            if (dailyDate) {
              const times = filterAvailableTimes(
                dailyDate.available_hours
                  .filter((hour) => hour.is_available)
                  .map((hour) => hour.time),
                firstDateStr,
              );

              setMonthlyTimeList(times);

              if (times.length > 0) {
                updateField("rentalTime", times[0]);
                setSelectedMonthlyTimeIndex(0);
              }
            }
          }
        }

        // تعيين التاريخ الأول تلقائياً للحجز اليومي
        if (bookingType === "daily" && dailyDates.length > 0) {
          const firstDate = dailyDates[0];
          const dateStr = format(firstDate, "yyyy-MM-dd");
          updateField("rentalDate", dateStr);
          setSelectedDateIndex(0);

          const selectedDate = (dailyData.available_dates || []).find(
            (d) => d.date === dateStr,
          );
          if (selectedDate) {
            const times = filterAvailableTimes(
              selectedDate.available_hours
                .filter((h) => h.is_available)
                .map((h) => h.time),
              dateStr,
            );
            setAvailableTimeList(times);
            if (times.length > 0) {
              updateField("rentalTime", times[0]);
              setSelectedTimeIndex(0);
            }
          }
        }
      } catch {
      // Continue with the existing fallback.
    } finally {
        setIsLoadingPeriods(false);
      }
    };

    fetchAllPeriods();
  }, [carId, rentalCompanyId, bookingType, setRentalMonths]);

  useEffect(() => {
    const { bookingData, updateField } = latestBooking.current;
    if (bookingData.rentalDate && availableDates.length > 0) {
      const selectedDate = availableDates.find(
        (d) => d.date === bookingData.rentalDate,
      );
      if (selectedDate) {
        const times = filterAvailableTimes(
          selectedDate.available_hours
            .filter((h) => h.is_available)
            .map((h) => h.time),
          bookingData.rentalDate,
        );

        setAvailableTimeList(times);
        setSelectedTimeIndex(0);

        // ✅ حدّث الوقت فقط لو مش موجود في القائمة الحالية
        if (times.length > 0 && !times.includes(bookingData.rentalTime)) {
          updateField("rentalTime", times[0]);
        }
      }
    }
  }, [bookingData.rentalDate, availableDates]);

  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    updateField("rentalDate", dateStr);

    const selectedDate = availableDates.find((d) => d.date === dateStr);
    if (selectedDate) {
      const times = filterAvailableTimes(
        selectedDate.available_hours
          .filter((h) => h.is_available)
          .map((h) => h.time),
        dateStr,
      );
      setAvailableTimeList(times);
      if (times.length > 0) {
        updateField("rentalTime", times[0]);
        setSelectedTimeIndex(0);
      }
    }
  };

  const handleMonthlyDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const monthKey = dateStr.slice(0, 7);

    updateField("rentalDate", dateStr);

    const month = availableMonths.find(
      (m) => m.month === monthKey && m.is_available,
    );

    if (month) {

      const period = month.available_periods[0];

      if (period) {
        setPeriodId(period.id);
        updateField("rentalDays", period.days_count);

        const monthsCount = Math.max(1, Math.round(period.days_count / 30));
        setRentalMonths(monthsCount);
      }
    }

    const selectedDate = availableDates.find((d) => d.date === dateStr);

    if (selectedDate) {
      const times = filterAvailableTimes(
        selectedDate.available_hours
          .filter((h) => h.is_available)
          .map((h) => h.time),
        dateStr,
      );

      setMonthlyTimeList(times);

      if (times.length > 0) {
        updateField("rentalTime", times[0]);
        setSelectedMonthlyTimeIndex(0);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    updateField("rentalTime", time);
  };

  const handleMonthSelect = (month: AvailableMonth) => {
    if (month.available_periods.length > 0) {
      const period = month.available_periods[0];
      updateField("rentalDate", month.month);
      updateField("rentalDays", period.days_count);
      setPeriodId(period.id);

      const monthsCount = Math.max(1, Math.round(period.days_count / 30));
      setRentalMonths(monthsCount);
    }
  };
  return {
    isLoadingPeriods,
    availableDateList,
    selectedDateIndex,
    setSelectedDateIndex,
    availableTimeList,
    selectedTimeIndex,
    setSelectedTimeIndex,
    monthlyDateList,
    monthlyTimeList,
    selectedMonthlyDateIndex,
    setSelectedMonthlyDateIndex,
    selectedMonthlyTimeIndex,
    setSelectedMonthlyTimeIndex,
    handleDateSelect,
    handleMonthlyDateSelect,
    handleTimeSelect,
    handleMonthSelect,
  };
}
