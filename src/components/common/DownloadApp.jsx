"use client";
import Image from "next/image";
import Link from "next/link";
import { FaGooglePlay, FaApple, FaMobile } from "react-icons/fa";

export default function DownloadApp() {
  return (
    
      <div className="">
        <div className="flex flex-col md:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          <div className="flex gap-3 lg:gap-4 justify-start">
            {/* Google Play */}
            <Link
              href="https://play.google.com/store/apps/details?id=com.tareek.qeyada"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[color-mix(in_srgb,var(--primary),black_15%)] hover:bg-[color-mix(in_srgb,var(--primary),black_25%)] rounded-[8px] lg:rounded-xl px-2 lg:px-4 py-1 lg:py-1 flex items-center gap-2 lg:gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
             
              <div className="text-end">
                <p className="text-xs text-white/70">GET IT ON</p>
                <p className="text-sm lg:text-base font-bold text-white">Google Play</p>
              </div>
               {/* <FaGooglePlay className="text-4xl" /> */}
               <Image src="/images/app1.png" alt="Google Play" width={26} height={26} className="w-6 h-7 lg:w-6 lg:h-7" />
            </Link>

            {/* App Store */}
            <Link
              href="https://apps.apple.com/eg/app/%D8%B7%D8%B1%D9%8A%D9%82-%D8%A7%D9%84%D9%82%D9%8A%D8%A7%D8%AF%D9%87-%D9%84%D8%AA%D8%A3%D8%AC%D9%8A%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA/id6743724845"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[color-mix(in_srgb,var(--primary),black_15%)] hover:bg-[color-mix(in_srgb,var(--primary),black_25%)]  rounded-[8px] lg:rounded-xl px-2 lg:px-4 py-1 lg:py-1 flex items-center gap-2 lg:gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              
              <div className="text-end">
                <p className="text-xs text-white/70">Download on the</p>
                <p className="text-sm lg:text-base  font-bold text-white">App Store</p>
              </div>
              <FaApple className="text-3xl lg:text-3xl text-white" />
               {/* <Image src="/images/app2.png" alt="App Store" width={30} height={30} /> */}

            </Link>
          </div>
        </div>
      </div>
 
  );
}
