'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function useOtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [isResend, setIsResend] = useState(false);

  const phoneNumber = '012345674910';
  const countryCode = '+966';

  // المؤقت التنازلي
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResend(true);
    }
  }, [timer]);

  // التعامل مع إدخال OTP
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // الانتقال تلقائياً للحقل التالي
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // التعامل مع حذف الرقم
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error(' يرجى إدخال الرمز المكون من 6 أرقام');
      return;
    }
    toast.success('تم التحقق بنجاح!');
    // توجيه إلى الصفحة الرئيسية أو لوحة التحكم
    window.location.href = '/';
  };

  const handleResend = () => {
    setTimer(59);
    setIsResend(false);
    toast.success('📨 تم إعادة إرسال الرمز');
  };

  return { otp, timer, isResend, phoneNumber, countryCode, handleOtpChange, handleKeyDown, handleSubmit, handleResend };
}
