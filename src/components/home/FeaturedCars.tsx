/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Card, CardContent } from "@/src/ui/card";
import { Button } from "@/src/ui/button";
import { FaCalendarDay, FaCalendarAlt } from "react-icons/fa";
import "swiper/css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CarService } from "@/src/services/carService";
import { Car } from "@/src/types/car";
import type { CarCatalogCategory, RentalPeriodType } from "@/src/types/carCatalog";
import { filterCarCatalog } from "@/src/utils/carCatalog";
import IconsFeatures from "./IconsFeatures";

function CarCard({
  car,
  period,
  onClick,
}: {
  car: Car;
  period: string;
  onClick: () => void;
}) {
  const price = car.pricePerDayAfterDiscount ?? car.pricePerDay;
  const image = car.image;
  const name = car.name;
  const year = car.year;
  const discount = car.discount;

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-xl bg-white transition-all duration-300 hover:-translate-y-2 rounded-xl my-6 cursor-pointer"
    >
      <CardContent className="bg-white p-4">
        <div className="h-28 lg:h-48 rounded-xl flex items-center justify-center relative overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={300}
            height={200}
            className="object-contain"
            priority
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              خصم {discount}%
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-sm lg:text-xl font-bold text-primary line-clamp-1">
                {name}
              </h3>
            </div>
            <span className="w-full border-b border-gray-200 mb-1 md:mb-8 pb-2 md:pb-4 text-center text-[#0079AB] font-bold text-sm md:text-base">
              {year}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm lg:text-2xl font-bold text-[#4b398e]">
              {price}
            </span>
            <div className="flex lg:flex-col items-center">
              <span className="text-xs lg:text-sm font-semibold text-[#4b398e]">ر.س</span>
              <span className="text-xs text-[#4b398e] font-semibold">/ {period}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeaturedCarsProps {
  onLoad?: () => void;
}

export default function FeaturedCars({ onLoad }: FeaturedCarsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RentalPeriodType>("daily");
  const [categories, setCategories] = useState<CarCatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCalledOnLoad = useRef(false);

  const sections = useMemo(
    () => filterCarCatalog(categories, activeTab),
    [categories, activeTab],
  );

  useEffect(() => {
    let cancelled = false;
    CarService.getCarCategoriesWithCars()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching car catalog:", err);
        if (!cancelled) setError("حدث خطأ في تحميل البيانات");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loading && !hasCalledOnLoad.current && onLoad) {
      hasCalledOnLoad.current = true;
      onLoad();
    }
  }, [loading, onLoad]);

  const handleCarClick = (carId: string | number, providerId?: number) => {
    if (!carId) {
      console.error("❌ Missing carId");
      return;
    }

    if (!providerId) {
      console.error("❌ Missing providerId for car:", carId);
      return;
    }

    const url = `/cars/${carId}?type=${activeTab}&officeId=${providerId}`;
    router.push(url);
  };

  const renderSections = () => {
    if (sections.length === 0) return null;

    return (
      <>
        {sections.map(({ id, name, cars }) => (
          <div key={id} className="mb-8 lg:mb-12">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 my-2">
              {name}
            </h3>
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView={2.2}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 2.5, spaceBetween: 7 },
                640: { slidesPerView: 2.5, spaceBetween: 7 },
                768: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 4.5, spaceBetween: 20 },
              }}
              className="px-4 max-h-75 md:max-h-87 lg:max-h-112"
              dir="rtl"
              touchRatio={1.5}
              resistance={true}
              resistanceRatio={0.85}
              grabCursor={true}
              speed={800}
            >
              {cars.map((car) => (
                <SwiperSlide key={`${car.providerId}-${car.id}`} className="mb-5 lg:mb-12">
                  <CarCard
                    car={car}
                    period={activeTab === "daily" ? "يومياً" : "شهرياً"}
                    onClick={() => handleCarClick(car.id, car.providerId)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="py-12" data-featured-cars-loading>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-100">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12" data-featured-cars-error>
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-2 pt-4 lg:pt-8" data-featured-cars-loaded>
      <div className="container mx-auto px-2">
        <div className="flex justify-center gap-4 mb-10">
          <Button
            onClick={() => setActiveTab("daily")}
            aria-pressed={activeTab === "daily"}
            className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${
              activeTab === "daily"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            <FaCalendarDay className="ml-2" />
            تأجير يومي
          </Button>

          <Button
            onClick={() => setActiveTab("monthly")}
            aria-pressed={activeTab === "monthly"}
            className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${
              activeTab === "monthly"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            <FaCalendarAlt className="ml-2" />
            تأجير شهري
          </Button>
        </div>

        <IconsFeatures />

        {renderSections() || (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === "daily"
                ? "لا توجد سيارات يومية متاحة حالياً"
                : "لا توجد سيارات شهرية متاحة حالياً"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}