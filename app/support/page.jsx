import SupportForm from '@/src/components/support/SupportForm';
import SupportChannels from '@/src/components/support/SupportChannels';
import { FaHeadset } from 'react-icons/fa';

export default function SupportPage() {
  return (
    <div className="min-h-screen mt-12 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeadset className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            الدعم الفني
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            فريق الدعم الفني جاهز لمساعدتك على مدار الساعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* بطاقات التواصل */}
          <SupportChannels />

          {/* نموذج إرسال رسالة */}
          <SupportForm />
        </div>
      </div>
    </div>
  );
}