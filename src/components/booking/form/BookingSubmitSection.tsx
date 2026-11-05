'use client';

import type { BookingFormController } from '@/src/hooks/booking/useBookingFormController';

type Props = BookingFormController['sections']['submit'];

export default function BookingSubmitSection({
  isSubmitting,
  isRedirecting,
  isCalculating,
  handleSubmit,
  isAuthenticated,
  isOTPLoading,
  isIdentityVerified,
  isVerifying,
}: Props) {
  return (
    <>
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          isCalculating ||
          isRedirecting ||
          isOTPLoading ||
          isVerifying ||
          (!isIdentityVerified && !isAuthenticated)
        }
        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            جاري الحجز...
          </span>
        ) : isRedirecting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            جاري التوجيه لبوابة الدفع...
          </span>
        ) : (
          `احجز الآن `
        )}
      </button>
      {!isIdentityVerified && !isAuthenticated && (
        <p className="text-xs text-center text-amber-600">
          ⚠️ يرجى التحقق من رقم الجوال لتفعيل زر الحجز
        </p>
      )}
    </>
  );
}
