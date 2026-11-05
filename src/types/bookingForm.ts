import type { useBookingForm } from '@/src/hooks/useBookingForm';
import type { AdditionalService } from '@/src/types/booking';
import type { mapCarBookingDetails } from '@/src/utils/carBookingAdapter';
import type { ComponentProps } from 'react';
import type CarDetails from '@/src/components/booking/CarDetails';

type BookingCar = ComponentProps<typeof CarDetails>['car'] & Partial<ReturnType<typeof mapCarBookingDetails>['car']> & {
  minimum_days?: number;
  office?: { id?: number };
};

export interface BookingPeriodInput {
  id?: number;
  label: string;
  days?: number;
  days_count?: number;
  price?: number;
  price_total?: number;
  final_price?: number;
}

export interface BookingFormProps {
  carId: string;
  car: BookingCar;
  services: (Omit<AdditionalService, 'id'> & { id: string | number })[];
  periods?: BookingPeriodInput[];
  rentalType?: "يومي" | "أسبوعي" | "شهري";
  initialRentalDays?: number;
}

export type BookingFormState = ReturnType<typeof useBookingForm>;
