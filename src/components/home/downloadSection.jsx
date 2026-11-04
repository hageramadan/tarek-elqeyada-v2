import DownloadApp from '@/src/components/common/DownloadApp';

export default function DownloadSection() {
  return (
    <section 
      className="container py-6 relative rounded-2xl lg:rounded-2xl overflow-hidden mx-auto w-[95%] lg:w-full my-6 flex items-center"
      style={{
        background: 'linear-gradient(135deg, #211039 0%, #38205E 55%, #4C2D83 100%)',
      }}
    >
      <div className="w-full px-4 relative z-10 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <h1 className='text-white font-bold text-sm sm:text-base lg:text-[28px] leading-tight'>
            حمل التطبيق واحجز سيارتك وتوصلك لمكانك
          </h1>
          <DownloadApp />
        </div>
      </div>
    </section>
  );
}
