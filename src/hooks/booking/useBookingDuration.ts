'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { BookingFormState, BookingFormProps } from "@/src/types/bookingForm";

type Options = Pick<BookingFormState, | 'bookingData'
  | 'updateField'
  | 'setPeriodId'
  | 'monthlyPeriods'
  | 'validateMonthlyPeriod'> & { car: BookingFormProps['car']; isWeekly: boolean; bookingType: 'daily' | 'monthly' };

export function useBookingDuration({
  car,
  isWeekly,
  bookingType,
  bookingData,
  updateField,
  setPeriodId,
  monthlyPeriods,
  validateMonthlyPeriod,
}: Options) {
  const latestBooking = useRef({ bookingData, updateField });
  latestBooking.current = { bookingData, updateField };
  const baseMinimumDays = car?.minimumDays || car?.minimum_days || 1;

  const minimumDays = isWeekly ? Math.max(7, Math.ceil(baseMinimumDays / 7) * 7) : baseMinimumDays;

  const rentalDayStep = isWeekly ? 7 : 1;

  const [rentalMonths, setRentalMonths] = useState<number>(1);

  useEffect(() => {
    if (bookingType !== "monthly") return;

    const validation = validateMonthlyPeriod(rentalMonths);
    if (!validation.isValid) {
      const fallbackPeriod = monthlyPeriods.find(
        (period) => period.id === validation.periodId,
      );
      if (fallbackPeriod) {
        setRentalMonths(Math.max(1, Math.round(fallbackPeriod.days_count / 30)));
      }
      return;
    }

    setPeriodId(validation.periodId ?? null);
    if (bookingData.rentalDays !== rentalMonths * 30) {
      updateField("rentalDays", rentalMonths * 30);
    }
  }, [bookingType, rentalMonths, monthlyPeriods, validateMonthlyPeriod, setPeriodId, bookingData.rentalDays, updateField]);

  useEffect(() => {
    const { bookingData, updateField } = latestBooking.current;
    if (bookingData.rentalDays < minimumDays) {
      updateField("rentalDays", minimumDays);
    }
  }, [minimumDays]);

  const incrementDays = () => {
    const currentDays = bookingData.rentalDays || minimumDays;
    updateField("rentalDays", currentDays + rentalDayStep);
  };

  const decrementDays = () => {
    const currentDays = bookingData.rentalDays || minimumDays;
    if (currentDays > minimumDays) {
      updateField("rentalDays", currentDays - rentalDayStep);
    } else {
      toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) * rentalDayStep;
    if (!isNaN(value)) {
      if (value >= minimumDays) {
        updateField("rentalDays", value);
      } else {
        toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
        updateField("rentalDays", minimumDays);
      }
    }
  };

  const incrementMonths = () => {
    const newMonths = (rentalMonths || 1) + 1;

    const validation = validateMonthlyPeriod(newMonths);

    if (!validation.isValid) {
      toast.error(validation.message, {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    setRentalMonths(newMonths);
    updateField("rentalDays", newMonths * 30);

    if (validation.periodId) {
      setPeriodId(validation.periodId);
    }
  };

  const decrementMonths = () => {
    const currentMonths = rentalMonths || 1;
    const newMonths = currentMonths - 1;

    const validation = validateMonthlyPeriod(newMonths);

    if (!validation.isValid) {
      toast.error(validation.message, {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    if (currentMonths > 1) {
      setRentalMonths(newMonths);
      updateField("rentalDays", newMonths * 30);

      if (validation.periodId) {
        setPeriodId(validation.periodId);
      }
    }
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;

    const validation = validateMonthlyPeriod(value);

    if (!validation.isValid) {
      toast.error(validation.message, {
        duration: 5000,
        position: "top-center",
      });

      if (validation.periodId) {
        const period = monthlyPeriods.find((p) => p.id === validation.periodId);
        if (period) {
          const fallbackMonths = Math.max(
            1,
            Math.round(period.days_count / 30),
          );
          setRentalMonths(fallbackMonths);
          updateField("rentalDays", period.days_count);
          setPeriodId(period.id);
        }
      }
      return;
    }

    setRentalMonths(value);
    updateField("rentalDays", value * 30);

    if (validation.periodId) {
      setPeriodId(validation.periodId);
    }
  };
  return {
    minimumDays,
    rentalDayStep,
    rentalMonths,
    setRentalMonths,
    incrementDays,
    decrementDays,
    handleDaysChange,
    incrementMonths,
    decrementMonths,
    handleMonthsChange,
  };
}
