"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";
import toast from "react-hot-toast";

export function useProfilePaymentCallback() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      // استخدام URLSearchParams من window.location
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment_status');
      const bookingId = params.get('booking_id');
      const uuid = params.get('uuid');
      const paymentMethodId = params.get('payment_method_id');

      if (paymentStatus && bookingId) {
        setIsProcessingCallback(true);

        try {
          const token = localStorage.getItem('token');

          if (paymentStatus === 'success' || paymentStatus === 'paid') {
            if (uuid && paymentMethodId) {
              await UpdatePaymentStatusService.updatePaymentSuccess(
                uuid,
                parseInt(paymentMethodId),
                {
                  return_data: Object.fromEntries(params.entries()),
                  status: paymentStatus
                },
                token || undefined
              );
            }

            toast.success('تم الدفع بنجاح!');
            setSelectedBookingId(parseInt(bookingId));
            setActiveTab('bookings');

            const newUrl = window.location.pathname + '?tab=bookings';
            router.replace(newUrl);

          } else {
            if (uuid && paymentMethodId) {
              await UpdatePaymentStatusService.updatePaymentFailed(
                uuid,
                parseInt(paymentMethodId),
                {
                  return_data: Object.fromEntries(params.entries()),
                  status: paymentStatus
                },
                token || undefined
              );
            }

            toast.error('❌ تم إلغاء الدفع أو فشل');
            setActiveTab('bookings');
          }
        } catch {

          toast.error('حدث خطأ في معالجة الدفع');
        } finally {
          setIsProcessingCallback(false);
        }
      }
    };

    handlePaymentCallback();
  }, [router]);

  useEffect(() => {
    // استخدام URLSearchParams من window.location
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'bookings') {
      setActiveTab('bookings');
    }
  }, []);

  return { activeTab, setActiveTab, selectedBookingId, isProcessingCallback };
}
