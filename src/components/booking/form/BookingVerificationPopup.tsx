'use client';
import OTPPopup from '../OTPPopup';
import { formatPhoneNumber } from '@/src/utils/bookingFormUtils';
import type { BookingFormController } from '@/src/hooks/booking/useBookingFormController';

type Props = BookingFormController['sections']['verification'];

export default function BookingVerificationPopup({
  bookingData,
  isOTPLoading,
  countryCode,
  setIsVerifying,
  isOTPPopupOpen,
  setIsOTPPopupOpen,
  handleVerifyOTPFromPopup,
  handleResendOTP,
}: Props) {
  return (
    <OTPPopup
      isOpen={isOTPPopupOpen}
      onClose={() => {
        setIsOTPPopupOpen(false);
        setIsVerifying(false);
      }}
      onVerify={handleVerifyOTPFromPopup}
      isLoading={isOTPLoading}
      phoneNumber={formatPhoneNumber(
        bookingData.customerPhone || "",
        countryCode,
      )}
      onResend={handleResendOTP}
    />
  );
}
