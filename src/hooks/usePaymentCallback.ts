"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";
import toast from "react-hot-toast";

export function usePaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<"success" | "failed" | "pending" | "cancelled">(
    "pending",
  );
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<"paymob" | "mispay" | "tamara" | "unknown">("unknown");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // ============================================
        // 1️⃣ استخراج جميع المعاملات من URL
        // ============================================
        const params = Object.fromEntries(searchParams.entries());

        // ============================================
        // 2️⃣ تحديد مزود الدفع
        // ============================================
        const isMISPay = searchParams.has("code") &&
          (searchParams.get("code")?.startsWith("MP") || false);

        const isPaymob = searchParams.has("success") ||
          searchParams.has("txn_response_code") ||
          searchParams.has("id");

        const isTamara = searchParams.has("paymentStatus") &&
          searchParams.has("orderId") &&
          (searchParams.get("paymentStatus") === "approved" ||
            searchParams.get("paymentStatus") === "canceled" ||
            searchParams.get("paymentStatus") === "declined");

        if (isMISPay) {
          setPaymentProvider("mispay");

          await handleMISPayCallback(params);
        } else if (isTamara) {
          setPaymentProvider("tamara");

          await handleTamaraCallback(params);
        } else if (isPaymob) {
          setPaymentProvider("paymob");

          await handlePaymobCallback(params);
        } else {
          // محاولة التعرف على المزود من المعاملات

          if (searchParams.has("order_uuid") && searchParams.has("payment_status")) {
            await handleGenericCallback(params);
          } else {
            toast.error("❌ مزود الدفع غير معروف");
            setStatus("failed");
            setIsProcessing(false);
          }
        }

      } catch (error: unknown) {

        setStatus("failed");
        toast.error("❌ حدث خطأ أثناء معالجة الدفع");

        const orderUuidParam = searchParams.get("order_uuid");
        const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam || ''}&error_message=${encodeURIComponent(errorMessage || 'حدث خطأ غير متوقع')}`);
        }, 1500);
      } finally {
        setIsProcessing(false);
      }
    };

    // ============================================
    // 3️⃣ معالجة Callback من Tamara
    // ============================================
    const handleTamaraCallback = async (params: Record<string, string>) => {

      // معاملات Tamara
      const paymentStatus = searchParams.get("paymentStatus"); // approved, canceled, declined
      const orderId = searchParams.get("orderId");

      // المعاملات المخصصة لتطبيقك
      const orderUuidParam = searchParams.get("order_uuid");
      const paymentMethodId = searchParams.get("payment_method_id");
      const bookingId = searchParams.get("booking_id");

      setOrderUuid(orderUuidParam);

      // ============================================
      // 4️⃣ تحديد حالة الدفع من Tamara
      // ============================================
      let isPaymentSuccess = false;
      let paymentStatusText = "failed";
      let statusMessage = "";

      switch (paymentStatus) {
        case "approved":
          isPaymentSuccess = true;
          paymentStatusText = "paid";
          statusMessage = "✅ تم الدفع بنجاح عبر تمارا";
          break;
        case "canceled":
          isPaymentSuccess = false;
          paymentStatusText = "cancelled";
          statusMessage = "⏹️ تم إلغاء الدفع عبر تمارا";
          break;
        case "declined":
          isPaymentSuccess = false;
          paymentStatusText = "failed";
          statusMessage = "❌ تم رفض الدفع عبر تمارا";
          break;
        default:
          isPaymentSuccess = false;
          paymentStatusText = "failed";
          statusMessage = `❌ حالة غير معروفة: ${paymentStatus}`;
          {}
      }

      // ============================================
      // 5️⃣ التحقق من وجود البيانات الأساسية
      // ============================================
      if (!orderUuidParam || !paymentMethodId) {

        toast.error("بيانات غير مكتملة");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      // ============================================
      // 6️⃣ الحصول على التوكن
      // ============================================
      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }

      if (!token) {

        toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      // ============================================
      // 7️⃣ بناء الـ Response كامل من Tamara
      // ============================================
      const paymentResponse = {
        // بيانات الدفع الأساسية
        provider: "tamara",
        payment_status: paymentStatus,
        order_id: orderId,
        message: statusMessage,

        // حالة الدفع
        success: isPaymentSuccess,
        status: paymentStatusText,

        // بيانات الحجز
        booking_id: bookingId,
        payment_method_id: paymentMethodId,

        // جميع المعاملات الخام
        raw: params,
      };

      // ============================================
      // 8️⃣ تحديث حالة الدفع
      // ============================================
      const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
        {
          order_uuid: orderUuidParam,
          payment_status: paymentStatusText, // paid / failed / cancelled
          payment_method_id: parseInt(paymentMethodId),
          response: paymentResponse,
        },
        token,
      );

      // ============================================
      // 9️⃣ معالجة النتيجة حسب الحالة
      // ============================================
      if (isUpdated && isPaymentSuccess) {
        setStatus("success");
        toast.success("✅ تم الدفع بنجاح عبر تمارا");

        localStorage.removeItem('currentBookingUUID');
        localStorage.removeItem('currentPaymentMethodId');

        setTimeout(() => {
          router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
        }, 1500);

      } else if (paymentStatus === "canceled") {
        // حالة الإلغاء
        setStatus("cancelled");
        toast.error("⏹️ تم إلغاء عملية الدفع عبر تمارا");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم إلغاء الدفع من قبل المستخدم&cancelled=true`);
        }, 1500);

      } else if (isUpdated && !isPaymentSuccess) {
        setStatus("failed");
        toast.error("❌ فشل الدفع عبر تمارا");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم رفض الدفع من تمارا (${paymentStatus})`);
        }, 1500);

      } else {
        setStatus("failed");
        toast.error("❌ فشل تحديث حالة الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل تحديث حالة الدفع`);
        }, 1500);
      }
    };

    // ============================================
    // 🔟 معالجة Callback من MIS Pay
    // ============================================
    const handleMISPayCallback = async (params: Record<string, string>) => {

      const code = searchParams.get("code");
      const transactionId = searchParams.get("transaction_id");
      const referenceId = searchParams.get("reference_id");
      const message = searchParams.get("message");
      const orderId = searchParams.get("order_id");

      const orderUuidParam = searchParams.get("order_uuid");
      const paymentMethodId = searchParams.get("payment_method_id");
      const bookingId = searchParams.get("booking_id");

      setOrderUuid(orderUuidParam);

      let isPaymentSuccess = false;
      let paymentStatusText = "failed";
      let statusMessage = "";

      switch (code) {
        case "MP00":
          isPaymentSuccess = true;
          paymentStatusText = "paid";
          statusMessage = "✅ تم الدفع بنجاح";
          break;
        case "MP01":
          isPaymentSuccess = false;
          paymentStatusText = "failed";
          statusMessage = "❌ فشل الدفع";
          break;
        case "MP02":
          isPaymentSuccess = false;
          paymentStatusText = "cancelled";
          statusMessage = "⏹️ تم إلغاء الدفع";
          break;
        default:
          isPaymentSuccess = false;
          paymentStatusText = "failed";
          statusMessage = `❌ كود غير معروف: ${code}`;
          {}
      }

      if (!orderUuidParam || !paymentMethodId) {

        toast.error("بيانات غير مكتملة");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }

      if (!token) {

        toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      const paymentResponse = {
        provider: "mispay",
        code: code,
        transaction_id: transactionId,
        reference_id: referenceId,
        order_id: orderId,
        message: message || statusMessage,
        success: isPaymentSuccess,
        status: paymentStatusText,
        booking_id: bookingId,
        payment_method_id: paymentMethodId,
        raw: params,
      };

      const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
        {
          order_uuid: orderUuidParam,
          payment_status: paymentStatusText,
          payment_method_id: parseInt(paymentMethodId),
          response: paymentResponse,
        },
        token,
      );

      if (isUpdated && isPaymentSuccess) {
        setStatus("success");
        toast.success("✅ تم الدفع بنجاح");
        localStorage.removeItem('currentBookingUUID');
        localStorage.removeItem('currentPaymentMethodId');

        setTimeout(() => {
          router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
        }, 1500);

      } else if (code === "MP02") {
        setStatus("cancelled");
        toast.error("⏹️ تم إلغاء عملية الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم إلغاء الدفع من قبل المستخدم&cancelled=true`);
        }, 1500);

      } else if (isUpdated && !isPaymentSuccess) {
        setStatus("failed");
        toast.error("❌ فشل الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم رفض الدفع من البنك (${code})`);
        }, 1500);

      } else {
        setStatus("failed");
        toast.error("❌ فشل تحديث حالة الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل تحديث حالة الدفع`);
        }, 1500);
      }
    };

    // ============================================
    // 1️⃣1️⃣ معالجة Callback من Paymob
    // ============================================
    const handlePaymobCallback = async (params: Record<string, string>) => {

      const id = searchParams.get("id");
      const success = searchParams.get("success");
      const pending = searchParams.get("pending");
      const order = searchParams.get("order");
      const txnResponseCode = searchParams.get("txn_response_code");
      const acqResponseCode = searchParams.get("acq_response_code");
      const responseMessage = searchParams.get("data.message");
      const errorOccured = searchParams.get("error_occured");
      const subType = searchParams.get("source_data.sub_type");
      const pan = searchParams.get("source_data.pan");

      const orderUuidParam = searchParams.get("order_uuid");
      const paymentMethodId = searchParams.get("payment_method_id");
      const bookingId = searchParams.get("booking_id");

      setOrderUuid(orderUuidParam);

      let isPaymentSuccess = false;
      let paymentStatusText = "failed";

      if (success === "true" && pending === "false") {
        isPaymentSuccess = true;
        paymentStatusText = "paid";
      }

      if (txnResponseCode === "APPROVED" || acqResponseCode === "00") {
        isPaymentSuccess = true;
        paymentStatusText = "paid";
      }

      if (responseMessage === "Approved" || responseMessage === "approved") {
        isPaymentSuccess = true;
        paymentStatusText = "paid";
      }

      if (errorOccured === "true") {
        isPaymentSuccess = false;
        paymentStatusText = "failed";
      }

      if (!orderUuidParam || !paymentMethodId) {

        toast.error("بيانات غير مكتملة");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }

      if (!token) {

        toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      const paymentResponse = {
        provider: "paymob",
        transaction_id: id,
        order_id: order,
        success: success === "true",
        pending: pending === "true",
        error_occured: errorOccured === "true",
        card_type: subType || "Unknown",
        card_last_four: pan || "****",
        response_code: acqResponseCode || txnResponseCode,
        response_message: responseMessage || txnResponseCode,
        booking_id: bookingId,
        payment_method_id: paymentMethodId,
        raw: params,
      };

      const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
        {
          order_uuid: orderUuidParam,
          payment_status: paymentStatusText,
          payment_method_id: parseInt(paymentMethodId),
          response: paymentResponse,
        },
        token,
      );

      if (isUpdated && isPaymentSuccess) {
        setStatus("success");
        toast.success("✅ تم الدفع بنجاح");
        localStorage.removeItem('currentBookingUUID');
        localStorage.removeItem('currentPaymentMethodId');

        setTimeout(() => {
          router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
        }, 1500);

      } else if (isUpdated && !isPaymentSuccess) {
        setStatus("failed");
        toast.error("❌ فشل الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم رفض الدفع من البنك`);
        }, 1500);

      } else {
        setStatus("failed");
        toast.error("❌ فشل تحديث حالة الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل تحديث حالة الدفع`);
        }, 1500);
      }
    };

    // ============================================
    // 1️⃣2️⃣ معالجة Callback عام
    // ============================================
    const handleGenericCallback = async (params: Record<string, string>) => {

      const orderUuidParam = searchParams.get("order_uuid");
      const paymentStatus = searchParams.get("payment_status");
      const paymentMethodId = searchParams.get("payment_method_id");
      const bookingId = searchParams.get("booking_id");

      setOrderUuid(orderUuidParam);

      if (!orderUuidParam || !paymentMethodId) {

        toast.error("بيانات غير مكتملة");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }

      if (!token) {

        toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
        setStatus("failed");
        setIsProcessing(false);
        return;
      }

      const isSuccess = paymentStatus === "paid" || paymentStatus === "success";
      const paymentStatusText = isSuccess ? "paid" : "failed";

      const paymentResponse = {
        provider: "generic",
        payment_status: paymentStatus,
        booking_id: bookingId,
        payment_method_id: paymentMethodId,
        raw: params,
      };

      const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
        {
          order_uuid: orderUuidParam,
          payment_status: paymentStatusText,
          payment_method_id: parseInt(paymentMethodId),
          response: paymentResponse,
        },
        token,
      );

      if (isUpdated && isSuccess) {
        setStatus("success");
        toast.success("✅ تم الدفع بنجاح");
        localStorage.removeItem('currentBookingUUID');
        localStorage.removeItem('currentPaymentMethodId');

        setTimeout(() => {
          router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
        }, 1500);
      } else {
        setStatus("failed");
        toast.error("❌ فشل الدفع");

        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل الدفع`);
        }, 1500);
      }
    };

    // ============================================
    // 1️⃣3️⃣ عرض حالة المعالجة
    // ============================================
    processPayment();
  }, [searchParams, router]);

  return { isProcessing, status, orderUuid, paymentProvider, retry: () => router.back() };
}
