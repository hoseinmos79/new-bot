"use client";
import { useEffect, useState } from 'react'; 
import axios from 'axios';
import EventCard from '../components/EventCard';
import Header from '../components/Header'; // اضافه شدن کامپوننت هدر مشترک
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; 

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/events/')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6]" dir="rtl">
      
      {/* --- فراخوانی هدر یکپارچه سایت --- */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* --- بخش جستجو (Hero Section) --- */}
        <div className="text-center mb-16 mt-6">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                رویداد مورد علاقه‌ت رو <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    همین الان پیدا کن!
                </span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
                از کنسرت و تئاتر تا کارگاه‌های آموزشی و سمینارها، همه چیز اینجاست.
            </p>
            
            {/* باکس جستجو */}
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto relative z-10">
                <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-xl focus-within:bg-white focus-within:ring-2 ring-blue-100 transition">
                    <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 ml-2" />
                    <input type="text" placeholder="جستجو (مثلاً: کنسرت تهران...)" className="bg-transparent w-full h-full outline-none text-gray-800 placeholder-gray-400 font-bold" />
                </div>
                
                <div className="w-px bg-gray-200 hidden md:block my-2"></div>

                <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition relative group">
                    <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-400 ml-2" />
                    <span className="text-gray-500 font-bold flex-1 text-right text-sm">همه دسته‌بندی‌ها</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>

                <button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition flex items-center gap-2 justify-center">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span className="hidden md:inline">بگرد</span>
                </button>
            </div>
        </div>

        {/* --- لیست کارت‌ها --- */}
        <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                تازه‌ترین رویدادها
            </h3>
            <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1 group">
                مشاهده همه
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
            </a>
        </div>

        {loading ? (
             <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        )}
      </main>
    </div>
  );
}