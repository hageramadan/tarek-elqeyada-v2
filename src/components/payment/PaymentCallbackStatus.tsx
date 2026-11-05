"use client";
import type { usePaymentCallback } from "@/src/hooks/usePaymentCallback";

export default function PaymentCallbackStatus({ isProcessing, status, orderUuid, paymentProvider, retry }: ReturnType<typeof usePaymentCallback>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              جاري معالجة الدفع...
            </h2>
            <p className="text-gray-600 mt-2">يرجى الانتظار لحظة</p>
            {paymentProvider !== "unknown" && (
              <p className="text-sm text-gray-400 mt-2">
                المزود: {paymentProvider === "mispay" ? "MIS Pay" : paymentProvider === "tamara" ? "Tamara" : "Paymob"}
              </p>
            )}
            {orderUuid && (
              <p className="text-sm text-gray-500 mt-4">
                رقم الطلب: {orderUuid}
              </p>
            )}
          </>
        ) : status === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600">✅ تم الدفع بنجاح!</h2>
            <p className="text-gray-600 mt-2">سيتم توجيهك إلى صفحة الحجز...</p>
          </>
        ) : status === "cancelled" ? (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-600">⏹️ تم إلغاء الدفع</h2>
            <p className="text-gray-600 mt-2">يمكنك المحاولة مرة أخرى في أي وقت</p>
            <button
              onClick={retry}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90"
            >
              المحاولة مرة أخرى
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600">❌ فشل الدفع</h2>
            <p className="text-gray-600 mt-2">حدث خطأ أثناء معالجة الدفع</p>
            <button
              onClick={retry}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90"
            >
              المحاولة مرة أخرى
            </button>
          </>
        )}
      </div>
    </div>
  );
}
