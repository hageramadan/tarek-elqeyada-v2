"use client";
import { useBookingSuccess } from '@/src/hooks/useBookingSuccess';
import ExtensionProcessing from '@/src/components/booking/results/ExtensionProcessing';
import ExtensionSuccess from '@/src/components/booking/results/ExtensionSuccess';
import ExtensionError from '@/src/components/booking/results/ExtensionError';
import NewBookingSuccess from '@/src/components/booking/results/NewBookingSuccess';

export default function BookingSuccessContent() {
  const { type, isProcessing, isExtensionSuccess, extensionError, uuid, orderUuid } = useBookingSuccess();
  if (type === 'extension') {
    if (isProcessing) return <ExtensionProcessing />;
    if (isExtensionSuccess) return <ExtensionSuccess uuid={uuid} />;
    if (extensionError) return <ExtensionError extensionError={extensionError} />;
  }
  return <NewBookingSuccess orderUuid={orderUuid} />;
}
