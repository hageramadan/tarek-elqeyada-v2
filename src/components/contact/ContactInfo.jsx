import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
export default function ContactInfo() {

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-base lg:text-lg font-bold text-gray-800 mb-6">معلومات الاتصال</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FaPhone className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">الهاتف</p>
              <p className="font-bold text-gray-800" dir="ltr">+966 50 000 0000</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FaEnvelope className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="font-bold text-gray-800" dir="ltr">info@carrent.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FaMapMarkerAlt className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">العنوان</p>
              <p className="font-bold text-gray-800">الرياض، المملكة العربية السعودية</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FaClock className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">أوقات العمل</p>
              <p className="font-bold text-gray-800">🕐 24/7 - طوال الأسبوع</p>
            </div>
          </div>
        </div>
      </div>

      {/* وسائل التواصل الاجتماعي */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-base lg:text-lg font-bold text-primary mb-4 mb-4">تابعنا</h2>
        <div className="flex gap-4 text-3xl">
          <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
            <FaWhatsapp />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>);
}
