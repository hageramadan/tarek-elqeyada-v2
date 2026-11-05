import Image from 'next/image';
import type { FeatureIcon } from '@/src/types/featureIcon';

interface IconsFeaturesProps {
  icons: FeatureIcon[];
}

function FeatureImage({ icon, className }: { icon: FeatureIcon; className: string }) {
  if (!icon.image) return null;

  return (
    <Image src={icon.image} alt={icon.title} width={24} height={24}
      className={className} loading="eager" unoptimized />
  );
}

export default function IconsFeatures({ icons }: IconsFeaturesProps) {
  if (icons.length === 0) return null;

  const topIcons = icons.filter((icon) => icon.top);
  const bottomIcons = icons.filter((icon) => !icon.top);

  return (
    <div className="bg-white py-4 px-1 lg:px-2 rounded-xl my-4 lg:my-8 mx-2 lg:mx-auto">
      {topIcons.length > 0 && (
        <div className="grid gap-1 lg:gap-4 mb-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(topIcons.length, 4)}, minmax(0, 1fr))` }}>
          {topIcons.map((icon, index) => (
            <div key={icon.id} className="relative">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 p-1 lg:p-4 rounded-[8px] transition-colors">
                <FeatureImage icon={icon} className="w-5 h-5 lg:w-7 lg:h-7 object-contain" />
                <p className="text-gray-800 font-semibold text-[9px] md:text-xs lg:text-base text-center lg:text-start">
                  {icon.title}
                </p>
              </div>
              {index % 4 !== 3 && index < topIcons.length - 1 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 lg:h-12 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}
      {bottomIcons.length > 0 && (
        <div className="grid gap-2 lg:gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(bottomIcons.length, 3)}, minmax(0, 1fr))` }}>
          {bottomIcons.map((icon) => (
            <div key={icon.id}
              className="flex items-center justify-center gap-1 lg:gap-3 p-1 lg:p-4 bg-[#6B46C10A] rounded-[8px] hover:bg-gray-200 transition-colors">
              <FeatureImage icon={icon} className="w-4 h-4 lg:w-7 lg:h-7 object-contain" />
              <p className="font-semibold text-gray-800 text-[9px] md:text-sm lg:text-base">
                {icon.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
