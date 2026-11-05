import Link from 'next/link';
import { FaArrowLeft, FaUser, FaUserPlus } from 'react-icons/fa';
import PhoneAccessForm from './PhoneAccessForm';

export default function PhoneAccessPage({ isRegister = false }) {
  const Icon = isRegister ? FaUserPlus : FaUser;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6">
          <FaArrowLeft />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon className="text-3xl text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{isRegister ? 'انشاء حساب' : 'تسجيل دخول'}</h1>
            <p className="text-gray-500 mt-2">يرجى إدخال رقم الهاتف لمتابعة عملية التسجيل</p>
          </div>

          <PhoneAccessForm isRegister={isRegister} />

          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
              <Link href={isRegister ? "/login" : "/register"} className="text-primary font-bold hover:underline">
                {isRegister ? 'تسجيل الدخول' : 'انشاء حساب'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}