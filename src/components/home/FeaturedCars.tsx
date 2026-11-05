"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import RentalPeriodTabs from "./RentalPeriodTabs";
import "swiper/css";
import CarCard from "./CarCard";
import { useRouter } from "next/navigation";
import { CarService } from "@/src/services/carService";
import { IconsService } from "@/src/services/iconsService";
import type { FeatureIcon } from "@/src/types/featureIcon";
import type { CarCatalogCategory, RentalPeriodType } from "@/src/types/carCatalog";
import { filterCarCatalog } from "@/src/utils/carCatalog";
import IconsFeatures from "./IconsFeatures";

interface FeaturedCarsProps {
  onLoad?: () => void;
}

export default function FeaturedCars({ onLoad }: FeaturedCarsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RentalPeriodType>("daily");
  const [categories, setCategories] = useState<CarCatalogCategory[]>([]);
  const [icons, setIcons] = useState<FeatureIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCalledOnLoad = useRef(false);

  const sections = useMemo(
    () => filterCarCatalog(categories, activeTab),
    [categories, activeTab],
  );

  useEffect(() => {
    let cancelled = false;
    const loadContent = async () => {
      const [catalogResult, iconsResult] = await Promise.allSettled([
        CarService.getCarCategoriesWithCars(),
        IconsService.getIcons(),
      ]);
      if (cancelled) return;

      if (catalogResult.status === 'fulfilled') {
        setCategories(catalogResult.value);
      } else {

        setError('حدث خطأ في تحميل البيانات');
      }

      if (iconsResult.status === 'fulfilled') {
        setIcons(iconsResult.value);
      } else {

      }
      setLoading(false);
    };
    loadContent();
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

      return;
    }

    if (!providerId) {

      return;
    }

    const url = `/cars/${carId}?type=${activeTab}&officeId=${providerId}`;
    router.push(url);
  };

  const renderSections = () => {
    if (sections.length === 0) return null;

    return (
      <>
        {sections.map(({ id, name, cars }, sectionIndex) => (
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
              {cars.map((car, carIndex) => (
                <SwiperSlide key={`${car.providerId}-${car.id}`} className="mb-5 lg:mb-12">
                  <CarCard
                    car={car}
                    priority={sectionIndex === 0 && carIndex < 3}
                    period={{ daily: "يومياً", weekly: "أسبوعياً", monthly: "شهرياً" }[activeTab]}
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
        <RentalPeriodTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <IconsFeatures icons={icons} />

        {renderSections() || (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === "daily"
                ? "لا توجد سيارات يومية متاحة حالياً"
                : activeTab === "weekly"
                  ? "لا توجد سيارات أسبوعية متاحة حالياً"
                  : "لا توجد سيارات شهرية متاحة حالياً"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
