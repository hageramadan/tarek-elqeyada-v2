import { FaClock, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
export default function SupportChannels() {

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="bg-green-500/10 p-3 rounded-full">
            <FaWhatsapp className="text-3xl text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">واتساب</p>
            <p className="font-bold text-gray-800" dir="ltr">+966 50 000 0000</p>
            <a href="#" className="text-green-500 text-sm font-bold hover:underline">
              تواصل الآن
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <FaPhone className="text-3xl text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">اتصال مباشر</p>
            <p className="font-bold text-gray-800" dir="ltr">+966 50 000 0000</p>
            <p className="text-xs text-gray-400">متاح 24/7</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-full">
            <FaEnvelope className="text-3xl text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="font-bold text-gray-800" dir="ltr">support@carrent.com</p>
            <p className="text-xs text-gray-400">نرد خلال 24 ساعة</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-full">
            <FaClock className="text-3xl text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">أوقات العمل</p>
            <p className="font-bold text-gray-800">🕐 24/7</p>
            <p className="text-xs text-gray-400">طوال أيام الأسبوع</p>
          </div>
        </div>
      </div>
    </div>);
}
