"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // گرفتن اطلاعات سایت از بک‌اند
    axios.get('http://127.0.0.1:8000/api/settings/')
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching settings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  const phones = settings?.support_phones ? settings.support_phones.split('\n') : [];

  return (
    <div className="min-h-screen bg-[#F8F9FD]" dir="rtl">
      <Header />
      
      {/* هدر صفحه */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 text-center shadow-inner">
        <h1 className="text-4xl font-black text-white mb-4">ارتباط با ما</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto px-4">ما همیشه آماده پاسخگویی به سوالات و شنیدن نظرات شما هستیم.</p>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ستون اطلاعات تماس */}
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 transform transition hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600"><PhoneIcon className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-gray-800">شماره‌های پشتیبانی</h2>
                </div>
                {phones.length > 0 ? (
                    phones.map((phone, index) => (
                        <p key={index} className="text-gray-600 text-lg mb-2 font-mono dir-ltr text-right">{phone}</p>
                    ))
                ) : (
                    <p className="text-gray-400">شماره‌ای ثبت نشده است.</p>
                )}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 transform transition hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600"><EnvelopeIcon className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-gray-800">ایمیل ارتباطی</h2>
                </div>
                <p className="text-gray-600 text-lg font-mono dir-ltr text-right">
                    {settings?.contact_email || 'ایمیلی ثبت نشده است.'}
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 transform transition hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600"><MapPinIcon className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-gray-800">آدرس مجموعه</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                    {settings?.contact_address || 'آدرسی ثبت نشده است.'}
                </p>
            </div>
        </div>

        {/* ستون درباره ما */}
        <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600"><InformationCircleIcon className="w-6 h-6" /></div>
                <h2 className="text-2xl font-black text-gray-800">درباره {settings?.site_title || 'مجموعه'}</h2>
            </div>
            <p className="text-gray-600 leading-8 text-justify whitespace-pre-line text-lg">
                {settings?.about_us || 'متن معرفی مجموعه هنوز در پنل مدیریت ثبت نشده است.'}
            </p>
        </div>

      </main>
    </div>
  );
}