'use client';
import { useRef,useState } from 'react';
import { useBookingFormController } from '@/src/hooks/booking/useBookingFormController';
import { useBookingPageLoading } from '@/src/hooks/booking/useBookingPageLoading';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import type { BookingFormProps } from '@/src/types/bookingForm';
import CarDetails from './CarDetails';
import BookingServices from './BookingServices';
import BookingSummary from './BookingSummary';
import BookingPayment from './BookingPayment';
import GoogleMapPicker from './GoogleMapPicker';
import DownloadSection2 from '../home/downloadSection2';
import Download3 from '../home/download3';
import BookingScheduleSection from './form/BookingScheduleSection';
import BookingIdentitySection from './form/BookingIdentitySection';
import BookingPickupSection from './form/BookingPickupSection';
import BookingSubmitSection from './form/BookingSubmitSection';
import BookingVerificationPopup from './form/BookingVerificationPopup';

export default function BookingForm(props: BookingFormProps) {
  const { car,rentalType='يومي' }=props;
  const {
    sections,
    bookingData,
    errors,
    totals,
    availableServices,
    isCalculating,
    isPriceReady,
    isLoadingServices,
    updateField,
    toggleService,
    isMapOpen,
    setIsMapOpen,
    handleSubmit,
    handleLocationSelect,
  }=useBookingFormController(props);
  const contentRef=useRef<HTMLDivElement>(null);
  const [isLoadingPaymentMethods,setIsLoadingPaymentMethods]=useState(true);
  const isInitialLoading=useBookingPageLoading({
    pageKey: `${props.carId}:${car.providerId??car.office?.id}:${rentalType}`,
    isDataReady: !sections.schedule.isLoadingPeriods&&!isLoadingServices&&
      !isLoadingPaymentMethods&&isPriceReady&&!isCalculating,
    contentRef,
  });

  return (
    <>
      <LoadingScreen isLoading={isInitialLoading} />
      <div ref={contentRef} aria-busy={isInitialLoading} aria-hidden={isInitialLoading}
        style={isInitialLoading? { visibility: 'hidden' }:undefined}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <CarDetails car={car} rentalType={rentalType} />
          </div>

          <div className="lg:col-span-1 ">
            <DownloadSection2 />
            <form onSubmit={handleSubmit} className="space-y-8 mb-4">
              <BookingIdentitySection {...sections.identity} />

              <BookingScheduleSection {...sections.schedule} />

              <BookingPickupSection {...sections.pickup} />
            </form>
            <BookingServices
              services={availableServices}
              selectedServices={bookingData.selectedServices}
              onToggle={toggleService}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <BookingSummary
              car={car}
              rentalDays={bookingData.rentalDays}
              totals={totals}
              deliveryFee={20}
              isCalculating={isCalculating}
            />

            <BookingPayment
              selectedMethod={bookingData.selectedPaymentMethod}
              onSelect={(id) => updateField("selectedPaymentMethod",id)}
              error={errors.selectedPaymentMethod}
              rentalType={rentalType==="أسبوعي"? "يومي":rentalType}
              onLoadingChange={setIsLoadingPaymentMethods}
            />

            <div
              id="recaptcha-container"
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                overflow: "hidden",
                opacity: 0,
                pointerEvents: "none",
              }}
            />

            <BookingSubmitSection {...sections.submit} />

            <Download3 />
          </div>

          <GoogleMapPicker
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onLocationSelect={handleLocationSelect}
            initialPosition={{ lat: 24.7136,lng: 46.6753 }}
          />
        </div>

        <BookingVerificationPopup {...sections.verification} />
      </div>
    </>
  );
}
