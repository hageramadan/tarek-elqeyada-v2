
export default function ExtensionProcessing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          جاري معالجة التمديد
        </h2>
        <p className="text-gray-600">يرجى الانتظار...</p>
      </div>
    </div>
  );
}
