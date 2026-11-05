import ContactForm from '@/src/components/contact/ContactForm';
import ContactInfo from '@/src/components/contact/ContactInfo';
import ContactMap from '@/src/components/contact/ContactMap';

export default function ContactPage() {
  return (
    <div className="min-h-screen  py-12 px-4 mt-12">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            تواصل معنا
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نسعد بتواصلك معنا، فريقنا جاهز للرد على استفساراتك على مدار الساعة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معلومات الاتصال */}
          <ContactInfo />

          {/* نموذج التواصل */}
          <ContactForm />
        </div>

        {/* الخريطة */}
        <ContactMap />
      </div>
    </div>
  );
}