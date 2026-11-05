'use client';
import { cn } from '@/src/lib/utils';
import toast from 'react-hot-toast';
import type { BookingFormController } from '@/src/hooks/booking/useBookingFormController';

type Props = Pick<BookingFormController['sections']['schedule'], | 'isWeekly'
  | 'bookingType'
  | 'bookingData'
  | 'errors'
  | 'updateField'
  | 'minimumDays'
  | 'rentalDayStep'
  | 'rentalMonths'
  | 'setRentalMonths'
  | 'incrementDays'
  | 'decrementDays'
  | 'handleDaysChange'
  | 'incrementMonths'
  | 'decrementMonths'
  | 'handleMonthsChange'>;

export default function BookingDurationFields({
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
}: Props) {
  return (
    <>
      {bookingType === "daily" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-[#1F2937] mb-2">
              {isWeekly ? "عدد أسابيع الحجز *" : "عدد أيام الحجز *"}
            </label>
            <p className="text-gray-500 text-sm">
              {bookingData.rentalDays || minimumDays} أيام
            </p>
          </div>
          <div className="flex items-center gap-2 mx-auto">
            <div className="flex items-center border-2 mx-auto rounded-xl overflow-hidden w-[90%] border-gray-200 focus-within:border-primary transition-colors">
              <button
                type="button"
                onClick={incrementDays}
                className="w-12 lg:w-16 h-12 bg-primary border-2 border-[var(--primary)] text-gray-100 hover:bg-gray-800 flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>

              <input
                type="number"
                min={minimumDays / rentalDayStep}
                step={1}
                value={(bookingData.rentalDays || minimumDays) / rentalDayStep}
                onChange={handleDaysChange}
                onBlur={() => {
                  if (
                    !bookingData.rentalDays ||
                    bookingData.rentalDays < minimumDays
                  ) {
                    updateField("rentalDays", minimumDays);
                    toast.error(
                      `الحد الأدنى للحجز هو ${minimumDays} أيام`,
                    );
                  }
                }}
                className={cn(
                  "w-full h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                  errors.rentalDays && "border-red-500",
                )}
              />

              <button
                type="button"
                onClick={decrementDays}
                className={cn(
                  "w-12 lg:w-16 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  (bookingData.rentalDays || minimumDays) <= minimumDays
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1F2937]",
                )}
              >
                -
              </button>
            </div>
          </div>
          {errors.rentalDays && (
            <p className="text-red-500 text-sm mt-2">
              {errors.rentalDays}
            </p>
          )}
        </div>
      )}
      {bookingType === "monthly" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-[#1F2937] mb-2">
              عدد أشهر الحجز *
            </label>
            <p className="text-gray-500 text-sm">
              {rentalMonths} {rentalMonths === 1 ? "شهر" : "أشهر"}
            </p>
          </div>
          <div className="flex items-center gap-2 mx-auto">
            <div className="flex items-center border-2 mx-auto rounded-xl overflow-hidden w-[90%] border-gray-200 focus-within:border-primary transition-colors">
              <button
                type="button"
                onClick={incrementMonths}
                className="w-12 lg:w-16 h-12 bg-primary border-2 border-[var(--primary)] text-gray-100 hover:bg-gray-800 flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>

              <input
                type="number"
                min={1}
                value={rentalMonths}
                onChange={handleMonthsChange}
                onBlur={() => {
                  if (!rentalMonths || rentalMonths < 1) {
                    setRentalMonths(1);
                    toast.error("الحد الأدنى للحجز هو شهر واحد");
                  }
                }}
                className={cn(
                  "w-full h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                  errors.rentalDays && "border-red-500",
                )}
              />

              <button
                type="button"
                onClick={decrementMonths}
                className={cn(
                  "w-12 lg:w-16 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  (rentalMonths || 1) <= 1
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1F2937]",
                )}
              >
                -
              </button>
            </div>
          </div>
          {errors.rentalDays && (
            <p className="text-red-500 text-sm mt-2">
              {errors.rentalDays}
            </p>
          )}
        </div>
      )}
    </>
  );
}
