"use client";
import { usePaymentCallback } from "@/src/hooks/usePaymentCallback";
import PaymentCallbackStatus from "@/src/components/payment/PaymentCallbackStatus";

export default function PaymentCallbackContent() {
  const payment = usePaymentCallback();
  return <PaymentCallbackStatus {...payment} />;
}
