'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/context/AuthContext';
import { usePhoneAuth } from '@/src/hooks/usePhoneAuth';
import { formatPhoneNumber } from '@/src/utils/bookingFormUtils';
import type { BookingFormState } from '@/src/types/bookingForm';

export function useBookingIdentity({ bookingData, updateField }: Pick<BookingFormState, 'bookingData' | 'updateField'>) {
  const { user, isAuthenticated, register } = useAuth();

  const {
    sendOTP,
    verifyOTP,
    isOTPSent,
    isLoading: isOTPLoading,
  } = usePhoneAuth();

  const [phoneNumber, setPhoneNumber] = useState("");

  const [countryCode, setCountryCode] = useState("+966");

  const [phoneInputKey, setPhoneInputKey] = useState(0);

  const [isUserRegistered, setIsUserRegistered] = useState(false);

  const [isIdentityVerified, setIsIdentityVerified] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  const [isOTPPopupOpen, setIsOTPPopupOpen] = useState(false);

  useEffect(() => {
    if (bookingData.customerPhone) {
      setPhoneNumber(bookingData.customerPhone);
    } else {
      setPhoneNumber("");
      setPhoneInputKey((prev) => prev + 1);
    }
  }, [bookingData.customerPhone]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name) {
        updateField("customerName", user.name);
      }
      if (user.phone) {
        const phone = user.phone.toString();
        setPhoneNumber(phone);
        updateField("customerPhone", phone);
      }
      if (user.country_code) {
        setCountryCode(user.country_code);
      }
      setIsUserRegistered(true);
      setIsIdentityVerified(true);
    }
  }, [isAuthenticated, user, updateField]);

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
    updateField("customerPhone", phone);
    setIsIdentityVerified(false);
    setIsUserRegistered(false);
    setIsVerifying(false);
  };

  const handleRegisterUser = async () => {
    try {
      const name = bookingData.customerName?.trim();
      const phone = bookingData.customerPhone?.trim();

      if (!name) {
        toast.error("يرجى إدخال الاسم");
        return false;
      }
      if (!phone) {
        toast.error("يرجى إدخال رقم الجوال");
        return false;
      }

      if (isAuthenticated) {
        setIsUserRegistered(true);
        return true;
      }

      const registerData = {
        name: name,
        phone: phone,
        country_code: countryCode || "+966",
      };

      const response = await register(registerData);

      if (!response?.result) {
        return false;
      }

      setIsUserRegistered(true);
      return true;
    } catch {

      return false;
    }
  };

  const handleSendOTP = async (): Promise<{
    success: boolean;
    errorCode?: string;
  }> => {
    const phone = bookingData.customerPhone?.trim();
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return { success: false, errorCode: "empty-phone" };
    }

    const formattedPhone = formatPhoneNumber(phone, countryCode);

    const result = (await sendOTP(formattedPhone)) as {
      success: boolean;
      errorCode?: string;
    };

    if (result.success) {
      setIsOTPPopupOpen(true);
    }

    return result;
  };

  const handleVerifyOTPFromPopup = async (code: string): Promise<boolean> => {
    const firebaseUser = await verifyOTP(code);

    if (!firebaseUser) {
      return false;
    }

    try {
      if (!isUserRegistered && !isAuthenticated) {
        const registered = await handleRegisterUser();

        if (!registered) {
          toast.error(
            "تم التحقق من الجوال لكن فشل تسجيل الحساب. حاول مرة أخرى.",
          );
          setIsVerifying(false);
          return false;
        }
      }
      setIsIdentityVerified(true);
      setIsOTPPopupOpen(false);
      setIsVerifying(false);
      toast.success("تم التحقق بنجاح");
      return true;
    } catch {

      toast.error("حدث خطأ أثناء تسجيل الحساب");
      setIsVerifying(false);
      return false;
    }
  };

  const handleResendOTP = async () => {
    const phone = bookingData.customerPhone?.trim();
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return;
    }

    const formattedPhone = formatPhoneNumber(phone, countryCode);
    const sent = await sendOTP(formattedPhone);
    if (sent.success) {
      toast.success("📱 تم إعادة إرسال رمز التحقق");
    }
  };

  const handleVerifyIdentity = async () => {
    const name = bookingData.customerName?.trim();
    const phone = bookingData.customerPhone?.trim();

    if (!name) {
      toast.error("يرجى إدخال الاسم");
      return;
    }
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return;
    }

    if (isIdentityVerified) {
      toast.success(" تم التحقق بالفعل");
      return;
    }

    setIsVerifying(true);

    try {
      if (!isOTPSent) {
        const result = await handleSendOTP();

        if (!result.success) {
          if (
            result.errorCode === "auth/too-many-requests" ||
            result.errorCode === "auth/billing-not-enabled"
          ) {
            toast.dismiss("otp-send-error");
            const registered = await handleRegisterUser();
            if (registered) {
              setIsIdentityVerified(false);
              setIsOTPPopupOpen(false);
              toast.success("تم تسجيل الحساب");
            } else {
              toast.error("تعذر تسجيل الحساب. حاول لاحقًا.");
            }
          }
          setIsVerifying(false);
          return;
        }
      } else {
        setIsOTPPopupOpen(true);
      }
    } catch {

      toast.error("حدث خطأ غير متوقع");
      setIsVerifying(false);
    }
  };
  return {
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
  };
}
