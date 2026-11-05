"use client";
import { Card, CardContent } from "@/src/ui/card";
import Image from "next/image";
import type { Car } from "@/src/types/car";

export default function CarCard({
  car,
  period,
  onClick,
  priority = false,
}: {
  car: Car;
  period: string;
  onClick: () => void;
  priority?: boolean;
}) {
  const price = car.pricePerDayAfterDiscount ?? car.pricePerDay;
  const image = car.image;
  const name = car.name;
  const year = car.year;
  const discount = Math.max(0, car.pricePerDay - price);

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
            priority={priority}
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              خصم {discount} ريال
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
            {car.pricePerDay > price && (
              <del className="text-xs lg:text-base text-gray-500" aria-label="السعر قبل الخصم">
                {car.pricePerDay}
              </del>
            )}
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