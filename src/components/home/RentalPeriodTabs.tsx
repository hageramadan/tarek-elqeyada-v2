"use client";
import { Button } from "@/src/ui/button";
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";
import type { RentalPeriodType } from "@/src/types/carCatalog";
export default function RentalPeriodTabs({ activeTab, setActiveTab }: { activeTab: RentalPeriodType; setActiveTab: (tab: RentalPeriodType) => void }) {

  return (
    <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-10">
      <Button
        onClick={() => setActiveTab("daily")}
        aria-pressed={activeTab === "daily"}
        className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${activeTab === "daily"
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
          }`}
      >
        <FaCalendarDay className="ml-2" />
        تأجير يومي
      </Button>

      <Button
        onClick={() => setActiveTab("weekly")}
        aria-pressed={activeTab === "weekly"}
        className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${activeTab === "weekly"
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
          }`}
      >
        <FaCalendarWeek className="ml-2" />
        تأجير أسبوعي
      </Button>

      <Button
        onClick={() => setActiveTab("monthly")}
        aria-pressed={activeTab === "monthly"}
        className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${activeTab === "monthly"
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
          }`}
      >
        <FaCalendarAlt className="ml-2" />
        تأجير شهري
      </Button>
    </div>);
}
