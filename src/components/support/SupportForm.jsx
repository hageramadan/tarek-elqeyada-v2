'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaMessage } from 'react-icons/fa6';
export default function SupportForm() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error(' يرجى كتابة رسالتك');
      return;
    }
    toast.success('تم إرسال رسالتك، سيتم الرد عليك خلال 24 ساعة');
    setMessage('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        أرسل رسالة
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        سنقوم بالرد عليك في أقرب وقت ممكن
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            رسالتك
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="اكتب مشكلتك أو استفسارك هنا..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
        >
          <FaMessage />
          إرسال الرسالة
        </button>
      </form>
    </div>);
}
