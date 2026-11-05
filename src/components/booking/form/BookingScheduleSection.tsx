'use client';
import BookingDurationFields from './BookingDurationFields';
import DateTimeSlider from '../DateTimeSlider';
import { formatTimeTo12Hour } from '@/src/utils/bookingFormUtils';
import type { BookingFormController } from '@/src/hooks/booking/useBookingFormController';

type Props = BookingFormController['sections']['schedule'];

export default function BookingScheduleSection(props: Props) {
  const {
    bookingType,
    errors,
    updateField,
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
  } = props;
  return (
    <div className="bg-[#FCF9F466] space-y-4 border rounded-lg p-3 lg:p-5">
      <div>
        <label className="block font-semibold text-sm text-[#1F2937] mb-2">
          تاريخ ووقت التوصيل *
        </label>

        {bookingType === "daily" ? (
          <DateTimeSlider
            dates={availableDateList}
            times={availableTimeList}
            selectedDateIndex={selectedDateIndex}
            selectedTimeIndex={selectedTimeIndex}
            onDateSelect={(date, index) => {
              setSelectedDateIndex(index);
              handleDateSelect(date);
            }}
            onTimeSelect={(time, index) => {
              setSelectedTimeIndex(index);
              handleTimeSelect(time);
            }}
            formatTime={formatTimeTo12Hour}
            isLoading={isLoadingPeriods}
          />
        ) : (
          <DateTimeSlider
            dates={monthlyDateList}
            times={monthlyTimeList}
            selectedDateIndex={selectedMonthlyDateIndex}
            selectedTimeIndex={selectedMonthlyTimeIndex}
            onDateSelect={(date, index) => {
              setSelectedMonthlyDateIndex(index);
              handleMonthlyDateSelect(date);
            }}
            onTimeSelect={(time, index) => {
              setSelectedMonthlyTimeIndex(index);
              updateField("rentalTime", time);
            }}
            formatTime={formatTimeTo12Hour}
            isLoading={isLoadingPeriods}
          />
        )}

        {errors.rentalDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.rentalDate}
          </p>
        )}

        {errors.rentalTime && (
          <p className="text-red-500 text-sm mt-1">
            {errors.rentalTime}
          </p>
        )}
      </div>

      {/* عدد الأيام للحجز اليومي */}
      <BookingDurationFields {...props} />

      {/* ✅ عدد الأشهر للحجز الشهري */}

    </div>
  );
}
