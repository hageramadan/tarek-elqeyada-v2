'use client';

import { useCarBookingDetails } from "@/src/hooks/useCarBookingDetails";
import { useParams, useSearchParams } from 'next/navigation';
import BookingForm from '@/src/components/booking/BookingForm';
import LoadingScreen from '@/src/components/common/LoadingScreen';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";
import { mapCarBookingDetails } from "@/src/utils/carBookingAdapter";

export default function CarBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const carId = parseInt(id);
  const officeId = searchParams.get('officeId') ? parseInt(searchParams.get('officeId')!) : null;
  const requestedType = searchParams.get('type');
  const type = requestedType === 'monthly' ? 'monthly'
    : requestedType === 'weekly' || (requestedType === 'daily' && searchParams.get('days') === '7')
      ? 'weekly' : 'daily';

  const { carData, loading, error } = useCarBookingDetails(carId, officeId, type);

  if (loading) {
    return <LoadingScreen isLoading />;
  }

  if (error || !carData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'السيارة غير موجودة'}</p>
          <Link href="/" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-xl">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // تحويل البيانات
  const { car, services, bookingPeriods } = mapCarBookingDetails(carData, type, officeId);

  const rentalType = type === 'weekly' ? 'أسبوعي' : type === 'monthly' ? 'شهري' : 'يومي';

  return (
    <div className="min-h-screen bg-white py-8 px-4 mt-12 lg:mt-16">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className='flex items-center gap-0.5 my-2 lg:my-5 hover:text-primary transition-colors'>
          <RiArrowRightSLine className='text-3xl' />
          <span className='text-base lg:text-lg text-primary'>تفاصيل السيارة</span>
          <span className='text-gray-400 mx-1'>/</span>
          <span className='text-base lg:text-lg text-gray-600'>{car.name}</span>
        </Link>

        <BookingForm
          carId={id}
          car={car}
          services={services}
          periods={bookingPeriods}
          rentalType={rentalType}
          initialRentalDays={type === 'weekly' ? Math.max(7, Math.ceil(car.minimumDays / 7) * 7) : undefined}
        />
      </div>
    </div>
  );
}
