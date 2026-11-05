"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useExtendBooking } from '@/src/hooks/useExtendBooking';
import { useAuth } from '@/src/context/AuthContext';

export function useBookingSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtensionSuccess, setIsExtensionSuccess] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);

  // قراءة المعلمات من URL
  const orderUuid = searchParams.get("order_uuid");
  const uuid = searchParams.get("uuid");
  const status = searchParams.get("status") || "success";
  const type = searchParams.get("type"); // "extension" أو null

  const onExtensionSuccess = useCallback(() => {
    setIsExtensionSuccess(true);
    toast.success("✅ تم تمديد الحجز بنجاح!", {
      duration: 5000,
      position: "top-center",
    });
    setTimeout(() => {
      router.push('/profile?tab=bookings');
    }, 3000);
  }, [router]);

  // استخدام Hook التمديد
  const { handlePaymentCallback } = useExtendBooking({
    bookingId: 0, // سيتم استبداله من localStorage
    carName: '',
    onSuccess: onExtensionSuccess,
  });

  // معالجة تمديد الحجز
  useEffect(() => {
    const processExtension = async () => {
      // التحقق من أن هذا طلب تمديد
      if (type !== 'extension') return;

      // التحقق من وجود uuid
      if (!uuid) {
        setExtensionError("❌ لا يوجد رقم طلب");
        return;
      }

      // التحقق من وجود token
      if (!token) {
        setExtensionError("❌ يرجى تسجيل الدخول");
        return;
      }

      setIsProcessing(true);

      try {
        // استدعاء دالة معالجة العودة من الدفع
        const success = await handlePaymentCallback(
          uuid,
          status as 'success' | 'failed'
        );

        if (success) {
          setIsExtensionSuccess(true);
          toast.success("✅ تم تمديد الحجز بنجاح!", {
            duration: 5000,
            position: "top-center",
          });
        } else {
          setExtensionError("❌ فشل تمديد الحجز");
          toast.error("❌ فشل تمديد الحجز، يرجى المحاولة مرة أخرى", {
            duration: 5000,
            position: "top-center",
          });
        }
      } catch (error: unknown) {

        const message = error instanceof Error ? error.message : "❌ حدث خطأ أثناء معالجة التمديد";
        setExtensionError(message);
        toast.error(message, {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processExtension();
  }, [type, uuid, status, token, handlePaymentCallback]);

  // معالجة الحجز الجديد (الكود الموجود)
  useEffect(() => {
    // فقط إذا كان حجز جديد (ليس تمديد)
    if (type !== 'extension' && orderUuid) {
      toast.success("🎉 تم الحجز بنجاح!", {
        duration: 5000,
        position: "top-center",
      });
    }
  }, [orderUuid, type]);

  return { type, isProcessing, isExtensionSuccess, extensionError, uuid, orderUuid };
}
