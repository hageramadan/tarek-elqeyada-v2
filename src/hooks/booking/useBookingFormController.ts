'use client';
import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useBookingForm } from '@/src/hooks/useBookingForm';
import { useBookingIdentity } from './useBookingIdentity';
import { useBookingDuration } from './useBookingDuration';
import { useBookingSchedule } from './useBookingSchedule';
import type { BookingFormProps, BookingFormState, BookingPeriodInput } from '@/src/types/bookingForm';

const EMPTY_PERIODS: BookingPeriodInput[] = [];

export function useBookingFormController({
  carId,
  car,
  services,
  periods = EMPTY_PERIODS,
  rentalType = 'يومي',
  initialRentalDays = 1,
}: BookingFormProps) {
  const rentalCompanyId = car?.providerId || car?.office?.id;

  const isWeekly = rentalType === "أسبوعي";

  const bookingType = rentalType === "شهري" ? "monthly" : "daily";

  const monthlyPeriodsFromProps = useMemo(() => {
    if (!periods || periods.length === 0) return [];

    const unique = new Map<number, { id: number; days_count: number; final_price: number | undefined; label: string }>();
    periods.forEach((p) => {
      if (p?.id && !unique.has(p.id)) {
        unique.set(p.id, {
          id: p.id,
          days_count: p.days_count || p.days || 30,
          final_price: p.final_price || p.price_total,
          label: p.label,
        });
      }
    });
    return Array.from(unique.values());
  }, [periods]);

  const {
    bookingData,
    errors,
    isSubmitting,
    isRedirecting,
    totals,
    availableServices,
    isCalculating,
    isPriceReady,
    isLoadingServices,
    updateField,
    toggleService,
    submit,
    resetForm,
    setPeriodId,
    validateMonthlyPeriod,
    monthlyPeriods,
    setAvailableMonthsData,
  } = useBookingForm(
    carId,
    car?.pricePerDay || 0,
    // Preserve API service IDs; the existing pricing hook types them as strings.
    services as BookingFormState['availableServices'],
    rentalCompanyId,
    bookingType,
    car?.name || "سياره",
    monthlyPeriodsFromProps,
    initialRentalDays,
    isWeekly ? "weekly" : bookingType,
  );

  const duration = useBookingDuration({
    car,
    isWeekly,
    bookingType,
    bookingData,
    updateField,
    setPeriodId,
    monthlyPeriods,
    validateMonthlyPeriod,
  });
  const {
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
  } = duration;
  const identity = useBookingIdentity({ bookingData, updateField });
  const {
    isAuthenticated,
    isOTPLoading,
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    phoneInputKey,
    setPhoneInputKey,
    setIsUserRegistered,
    isIdentityVerified,
    setIsIdentityVerified,
    isVerifying,
    setIsVerifying,
    isOTPPopupOpen,
    setIsOTPPopupOpen,
    handlePhoneChange,
    handleVerifyOTPFromPopup,
    handleResendOTP,
    handleVerifyIdentity,
  } = identity;
  const schedule = useBookingSchedule({
    carId,
    rentalCompanyId,
    bookingType,
    bookingData,
    updateField,
    setPeriodId,
    setAvailableMonthsData,
    setRentalMonths,
  });
  const {
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
  } = schedule;

  const [isMapOpen, setIsMapOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const validateForm = useCallback(() => {
    const name = bookingData.customerName?.trim();
    const phone = bookingData.customerPhone?.trim();
    const rentalDate = bookingData.rentalDate;
    const rentalTime = bookingData.rentalTime;
    const rentalDays = bookingData.rentalDays;
    const paymentMethod = bookingData.selectedPaymentMethod;

    if (!name) {
      toast.error("يرجى إدخال الاسم");
      return false;
    }

    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return false;
    }

    if (!rentalDate) {
      toast.error("يرجى اختيار تاريخ الاستلام");
      return false;
    }

    if (!rentalTime) {
      toast.error("يرجى اختيار وقت الاستلام");
      return false;
    }

    if (bookingType === "daily" && (!rentalDays || rentalDays < minimumDays)) {
      toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
      return false;
    }

    if (bookingType === "monthly") {
      const validation = validateMonthlyPeriod(rentalMonths);
      if (!validation.isValid) {
        toast.error(validation.message);
        return false;
      }
    }

    if (!selectedAddress) {
      toast.error("يرجى تحديد موقع الاستلام على الخريطة");
      return false;
    }

    if (!paymentMethod) {
      toast.error("يرجى اختيار طريقة الدفع");
      return false;
    }

    return true;
  }, [bookingData, bookingType, minimumDays, selectedAddress, rentalMonths, validateMonthlyPeriod]);

  const handleResetForm = useCallback(() => {
    resetForm();
    setPhoneNumber("");
    setCountryCode("+966");
    setSelectedAddress("");
    setPhoneInputKey((prev) => prev + 1);
    setIsIdentityVerified(false);
    setIsVerifying(false);
    setIsUserRegistered(false);
    setIsOTPPopupOpen(false);
    toast.success("🔄 تم إعادة تعيين النموذج");
  }, [resetForm, setPhoneNumber, setCountryCode, setPhoneInputKey, setIsIdentityVerified, setIsVerifying, setIsUserRegistered, setIsOTPPopupOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isIdentityVerified && !isAuthenticated) {
      toast.error("يرجى التحقق من هويتك أولاً");
      return;
    }

    if (!validateForm()) return;

    await submit();
  };

  const handleLocationSelect = async (
    lat: number,
    lng: number,
    address: string,
  ) => {
    setSelectedAddress(address);
    updateField(
      "pickupLocation",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    );
    updateField(
      "pickupAddress",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    );
    updateField("pickupLat", lat);
    updateField("pickupLng", lng);
  };
  return {
    sections: {
      identity: {
        bookingData,
        errors,
        updateField,
        isOTPLoading,
        phoneNumber,
        phoneInputKey,
        isIdentityVerified,
        isVerifying,
        handlePhoneChange,
        handleVerifyIdentity,
      },
      schedule: {
        isWeekly,
        bookingType,
        bookingData,
        errors,
        updateField,
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
      },
      pickup: { setIsMapOpen, selectedAddress },
      submit: {
        isSubmitting,
        isRedirecting,
        isCalculating,
        handleSubmit,
        isAuthenticated,
        isOTPLoading,
        isIdentityVerified,
        isVerifying,
      },
      verification: {
        bookingData,
        isOTPLoading,
        phoneNumber,
        countryCode,
        setIsVerifying,
        isOTPPopupOpen,
        setIsOTPPopupOpen,
        handleVerifyOTPFromPopup,
        handleResendOTP,
      },
    },
    bookingData,
    errors,
    totals,
    availableServices,
    isCalculating,
    updateField,
    toggleService,
    isMapOpen,
    setIsMapOpen,
    handleSubmit,
    handleLocationSelect,
    handleResetForm,
    isPriceReady,
    isLoadingServices,
  };
}

export type BookingFormController = ReturnType<typeof useBookingFormController>;
