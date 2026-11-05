import LegalFooter from '@/src/components/legal/LegalFooter';
import LegalSection from '@/src/components/legal/LegalSection';
import { FaLock, FaEye, FaUserSecret } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen mt-12 py-12 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">

          <h1 className="text-xl lg:text-3xl font-bold text-gray-800 mb-4">
            سياسة الخصوصية
          </h1>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* مقدمة */}
          <LegalSection title={<><FaLock className="text-primary" />مقدمة
          </>} decorated>
            <p className="text-gray-600 leading-relaxed">
              نحن في طريق القيادة لتأجير السيارات (نحن أو الشركة) نلتزم بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام موقعنا الإلكتروني وخدماتنا.
            </p>
          </LegalSection>

          {/* المعلومات التي نجمعها */}
          <LegalSection title={<><FaEye className="text-primary" />المعلومات التي نجمعها
          </>} decorated>
            <p className="text-gray-600 font-semibold mt-2">2.1 المعلومات التي تقدمها لنا</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4">
              <li>الاسم الكامل</li>
              <li>رقم الهاتف</li>
              <li>البريد الإلكتروني</li>
              {/* <li>معلومات الرخصة</li> */}
              {/* <li>معلومات الدفع</li> */}
              <li>معلومات الحجز (التواريخ، الموقع، نوع السيارة)</li>
            </ul>
            <p className="text-gray-600 font-semibold mt-4">2.2 المعلومات التي نجمعها تلقائياً</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4">
              <li>عنوان IP</li>
              <li>نوع المتصفح ونظام التشغيل</li>
              <li>معلومات الجهاز</li>
              <li>بيانات الاستخدام والتفاعل مع الموقع</li>
            </ul>
          </LegalSection>

          {/* كيفية استخدام المعلومات */}
          <LegalSection title={<><FaUserSecret className="text-primary" />كيفية استخدام المعلومات
          </>} decorated>
            <p className="text-gray-600 leading-relaxed">
              نستخدم المعلومات التي نجمعها للأغراض التالية:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4 mt-2">
              <li>معالجة وإدارة الحجوزات</li>
              <li>التواصل معك بخصوص حجوزاتك</li>
              <li>تحسين خدماتنا وتجربة المستخدم</li>
              <li>إرسال التحديثات والعروض الترويجية (بموافقتك)</li>
              <li>الامتثال للالتزامات القانونية</li>
              <li>منع الاحتيال وحماية أمن الموقع</li>
            </ul>
          </LegalSection>

          {/* مشاركة المعلومات */}
          <LegalSection title={<>مشاركة المعلومات</>}>
            <p className="text-gray-600 leading-relaxed">
              نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك مع:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4 mt-2">
              <li><span className="font-semibold">مزودي الخدمات:</span> الشركات التي تساعدنا في تشغيل موقعنا (مثل معالجة المدفوعات، الاستضافة)</li>
              <li><span className="font-semibold">شركات التأجير:</span> شركات تأجير السيارات التي نتعامل معها لتنفيذ الحجوزات</li>
              <li><span className="font-semibold">السلطات القانونية:</span> عند الحاجة للامتثال للقوانين أو حماية حقوقنا</li>
            </ul>
          </LegalSection>

          {/* حماية المعلومات */}
          <LegalSection title={<>حماية المعلومات</>}>
            <p className="text-gray-600 leading-relaxed">
              نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. نستخدم تقنيات التشفير والجدران النارية وأنظمة الحماية المتقدمة.
            </p>
          </LegalSection>

          {/* ملفات تعريف الارتباط */}
          <LegalSection title={<>ملفات تعريف الارتباط (Cookies)</>}>
            <p className="text-gray-600 leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
            </p>
          </LegalSection>

          {/* حقوقك */}
          <LegalSection title={<>حقوقك</>}>
            <p className="text-gray-600 leading-relaxed">
              لديك الحق في:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4 mt-2">
              <li>الوصول إلى معلوماتك الشخصية</li>
              <li>تصحيح المعلومات غير الدقيقة</li>
              <li>طلب حذف معلوماتك</li>
              <li>الاعتراض على معالجة معلوماتك</li>
              <li>طلب نقل معلوماتك</li>
            </ul>
          </LegalSection>

          {/* الاحتفاظ بالبيانات */}
          <LegalSection title={<>الاحتفاظ بالبيانات</>}>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بمعلوماتك الشخصية طالما كانت ضرورية لتقديم خدماتنا والامتثال للالتزامات القانونية. بعد انتهاء هذه الفترة، سنقوم بحذف أو إخفاء هوية معلوماتك بشكل آمن.
            </p>
          </LegalSection>

          {/* التغييرات على سياسة الخصوصية */}
          <LegalSection title={<>التغييرات على سياسة الخصوصية</>}>
            <p className="text-gray-600 leading-relaxed">
              قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية من خلال نشر السياسة المحدثة على موقعنا مع تحديث تاريخ آخر تحديث
            </p>
          </LegalSection>

          {/* الاتصال بنا */}
          <LegalSection title={<>الاتصال بنا</>}>
            <p className="text-gray-600 leading-relaxed">
              إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارساتنا، يرجى الاتصال بنا:
            </p>
            <ul className="list-none text-gray-600 space-y-1 mt-2">
              <li><span className="font-semibold">البريد الإلكتروني:</span> privacy@mashiha.com</li>
              {/* <li><span className="font-semibold">الهاتف:</span> +966 50 123 4567</li> */}
              <li><span className="font-semibold">العنوان:</span> المملكة العربية السعودية</li>
            </ul>
          </LegalSection>

          <LegalFooter />
        </div>
      </div>
    </div>
  );
}