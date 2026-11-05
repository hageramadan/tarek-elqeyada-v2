'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaPhone, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PhoneInput from '@/src/components/contact/PhoneInput';

export default function PhoneAccessForm({ isRegister = false }) {
  const SubmitIcon = isRegister ? FaUserPlus : FaPhone;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');

  const handlePhoneChange = (phone, code) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error(' يرجى إدخال رقم هاتف صحيح');
      return;
    }

    toast.success('تم إرسال رمز التحقق');
    window.location.href = `/otp?phone=${phoneNumber}&code=${countryCode}${isRegister ? "&type=register" : ""}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          <FaPhone className="inline ml-1 text-primary" />
          رقم الهاتف
        </label>

        <PhoneInput
          value={phoneNumber}
          onChange={handlePhoneChange}
          required={true}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        <SubmitIcon className="ml-2" />
        {isRegister ? 'انشاء حساب' : 'تسجيل الدخول'}
      </Button>
    </form>);
}
