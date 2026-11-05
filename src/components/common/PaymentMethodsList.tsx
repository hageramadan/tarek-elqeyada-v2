// src/components/common/PaymentMethodsList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { CreditCard, HandCoins } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { CarService } from "@/src/services/carService";
import { PaymentMethodType } from "@/src/services/paymentService";
import toast from "react-hot-toast";

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface PaymentMethodsListProps {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
  error?: string;
  rentalType?: "يومي" | "شهري";
  onMethodsLoaded?: (methods: PaymentMethod[]) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

const CASH_PAYMENT_METHOD: PaymentMethod = {
  id: String(PaymentMethodType.CASH),
  name: "الدفع عند الاستلام",
  image: "",
};

const MISPAY_PAYMENT_METHOD: PaymentMethod = {
  id: String(PaymentMethodType.MISPAY),
  name: "MISPay",
  image: "",
};

export default function PaymentMethodsList({
  selectedMethod,
  onSelect,
  error,
  rentalType = "يومي",
  onMethodsLoaded,
  onLoadingChange,
}: PaymentMethodsListProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const availableMethods = useMemo(() => {
    if (rentalType === "شهري") {
      const monthlyMethods = paymentMethods.filter(
        (method) => method.id !== CASH_PAYMENT_METHOD.id,
      );

      if (!monthlyMethods.some((method) => method.id === MISPAY_PAYMENT_METHOD.id)) {
        monthlyMethods.push(MISPAY_PAYMENT_METHOD);
      }

      return [
        ...monthlyMethods,
        CASH_PAYMENT_METHOD,
      ];
    }

    return paymentMethods;
  }, [paymentMethods, rentalType]);

  useEffect(() => {
    if (!isLoading || rentalType === "شهري") {
      onMethodsLoaded?.(availableMethods);
    }
  }, [availableMethods, isLoading, rentalType, onMethodsLoaded]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await CarService.getPaymentMethods();

        const loadedMethods = methods.map((method) => ({
          id: String(method.id),
          name: method.name,
          image: method.image  || "/images/payment/visa.png",
          // description: method.description,
        }));

        setPaymentMethods(loadedMethods);
      } catch {

        toast.error("حدث خطأ في تحميل طرق الدفع");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (isLoading && rentalType !== "شهري") {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (availableMethods.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        لا توجد طرق دفع متاحة حالياً
      </p>
    );
  }

  return (
    <div className=" grid grid-cols-2 lg:grid-cols-2 gap-3">
      {availableMethods.map((method) => {
        const isSelected = selectedMethod === method.id;
        const isCashPayment = /cash|نقد|استلام|توصيل/i.test(method.name);

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded-lg border transition-all duration-100 text-right",
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-gray-200 hover:border-primary/30 hover:bg-gray-50",
            )}
          >
            <div className="w-9 lg:w-12 h-7 shrink-0 flex items-center justify-center">
              {isCashPayment ? (
                <HandCoins className="w-7 h-7 text-primary" aria-hidden="true" />
              ) : !method.image ? (
                <CreditCard className="w-7 h-7 text-primary" aria-hidden="true" />
              ) : (
              <Image
                src={method.image}
                alt={method.name}
                width={400}
                height={400}
                className="object-contain w-full h-full"
                unoptimized
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/payment/visa.png";
                }}
              />
              )}
            </div>

            <div className="flex-1">
              <p className="font-bold lg:font-medium text-gray-800 text-[10px] lg:text-sm">{method.name}</p>

            </div>

            <div
              className={cn(
                "w-5 h-5 rounded-full  flex items-center justify-center transition-all duration-200 shrink-0",
                isSelected
                  ? "border-0 bg-[#4b398e]"
                  : "border-gray-300 bg-white",
              )}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

// src/components/common/PaymentMethodsList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import Image from "next/image";
// import { cn } from "@/src/lib/utils";
// import { useState, useEffect } from "react";
// import { CarService } from "@/src/services/carService";
// import toast from "react-hot-toast";

// interface PaymentMethod {
//   id: string;
//   name: string;
//   image: string;
//   description?: string;
// }

// interface PaymentMethodsListProps {
//   selectedMethod: string | null;
//   onSelect: (id: string) => void;
//   error?: string;
//   rentalType?: "يومي" | "شهري";
//   onMethodsLoaded?: (methods: PaymentMethod[]) => void;
// }

// export default function PaymentMethodsList({
//   selectedMethod,
//   onSelect,
//   error,
//   rentalType = "يومي",
//   onMethodsLoaded,
// }: PaymentMethodsListProps) {
//   const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchPaymentMethods = async () => {
//       try {
//         setIsLoading(true);
//         const methods = await CarService.getPaymentMethods();

//         let filteredMethods = methods.map((method) => ({
//           id: String(method.id),
//           name: method.name,
//           image: method.image || "/images/payment/visa.png",
//           // description: method.description,
//         }));

//         // إخفاء طريقة الدفع Apple Pay
//         filteredMethods = filteredMethods.filter(
//           (method) =>
//             !method.name.toLowerCase().includes("apple") &&
//             !method.name.includes("ابل باى") &&
//             !method.name.includes("آبل باي"),
//         );

//         if (rentalType === "يومي") {
//           filteredMethods = filteredMethods.filter(
//             (method) =>
//               method.name.toLowerCase() !== "دفع نقدي بعد توصيل السيارة",
//           );
//         }

//         setPaymentMethods(filteredMethods);

//         if (onMethodsLoaded) {
//           onMethodsLoaded(filteredMethods);
//         }
//       } catch (error) {//         toast.error("حدث خطأ في تحميل طرق الدفع");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPaymentMethods();
//   }, [rentalType, onMethodsLoaded]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (paymentMethods.length === 0) {
//     return (
//       <p className="text-center text-gray-500 py-4">
//         لا توجد طرق دفع متاحة حالياً
//       </p>
//     );
//   }

//   return (
//     <div className=" grid grid-cols-2 lg:grid-cols-2 gap-3">
//       {paymentMethods.map((method) => {
//         const isSelected = selectedMethod === method.id;

//         return (
//           <button
//             key={method.id}
//             type="button"
//             onClick={() => onSelect(method.id)}
//             className={cn(
//               "w-full flex items-center gap-2 p-2 rounded-lg border transition-all duration-100 text-right",
//               isSelected
//                 ? "border-primary bg-primary/5 ring-2 ring-primary/20"
//                 : "border-gray-200 hover:border-primary/30 hover:bg-gray-50",
//             )}
//           >
//             <div className="w-9 lg:w-12 h-7 shrink-0 flex items-center justify-center">
//               <Image
//                 src={method.image}
//                 alt={method.name}
//                 width={400}
//                 height={400}
//                 className="object-contain w-full h-full"
//                 unoptimized
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.src = "/images/payment/visa.png";
//                 }}
//               />
//             </div>

//             <div className="flex-1">
//               <p className="font-bold lg:font-medium text-gray-800 text-[10px] lg:text-sm">
//                 {method.name}
//               </p>
//             </div>

//             <div
//               className={cn(
//                 "w-5 h-5 rounded-full  flex items-center justify-center transition-all duration-200 shrink-0",
//                 isSelected
//                   ? "border-0 bg-[#4b398e]"
//                   : "border-gray-300 bg-white",
//               )}
//             >
//               {isSelected && (
//                 <svg
//                   className="w-3 h-3 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4.5 12.75l6 6 9-13.5"
//                   />
//                 </svg>
//               )}
//             </div>
//           </button>
//         );
//       })}

//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//     </div>
//   );
// }
