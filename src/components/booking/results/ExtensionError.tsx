import Link from 'next/link';

export default function ExtensionError({ extensionError }: { extensionError: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ❌ فشل تمديد الحجز
        </h1>

        <p className="text-red-600 mb-6">{extensionError}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/profile?tab=bookings"
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            العودة للحجوزات
          </Link>

          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
