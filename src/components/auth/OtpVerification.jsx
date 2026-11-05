'use client';
import { useOtpVerification } from '@/src/hooks/useOtpVerification';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

export default function OtpVerification() {
  const { otp, timer, isResend, phoneNumber, countryCode, handleOtpChange, handleKeyDown, handleSubmit, handleResend } = useOtpVerification();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-md">
        {/* العودة */}
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6">
          <FaArrowLeft />
          <span>رجوع</span>
        </Link>

        {/* بطاقة OTP */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* العنوان */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">التحقق من الهاتف</h1>
            <p className="text-gray-500 mt-2">
              أدخل الرقم المكون من 6 أرقام الذي أرسلناه عبر رقم الهاتف:
            </p>
            <p className="text-primary font-bold text-lg mt-1" dir="ltr">
              {countryCode} {phoneNumber}
            </p>
          </div>

          {/* نموذج OTP */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50"
                  dir="ltr"
                />
              ))}
            </div>

            {/* المؤقت وإعادة الإرسال */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500">
                {timer > 0 ? (
                  <span dir="ltr">00:{timer.toString().padStart(2, '0')}</span>
                ) : (
                  <span className="text-red-500">انتهى الوقت</span>
                )}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!isResend}
                className={`text-sm font-bold transition-colors ${isResend
                    ? 'text-primary hover:underline'
                    : 'text-gray-400 cursor-not-allowed'
                  }`}
              >
                لم تستلم الرمز؟ اعادة ارسال
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              استمرار
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}