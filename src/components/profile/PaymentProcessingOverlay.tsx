
export default function PaymentProcessingOverlay() {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-bold text-gray-800">جاري معالجة الدفع...</h3>
        <p className="text-sm text-gray-500 mt-1">يرجى الانتظار</p>
      </div>
    </div>);
}
