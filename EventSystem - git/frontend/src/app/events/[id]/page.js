"use client";
import { useEffect, useState, useContext, use } from 'react';
import axios from 'axios';
import { 
  MapPinIcon, 
  UserIcon, 
  CalendarIcon, 
  ClockIcon, 
  TicketIcon, 
  ShareIcon, 
  HeartIcon,
  AcademicCapIcon // آیکون جدید برای مدرس
} from '@heroicons/react/24/solid';
import { AuthContext } from '../../../context/AuthContext'; 
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';

export default function EventDetail({ params }) {
  const { id } = use(params); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (id) {
        axios.get(`http://127.0.0.1:8000/api/events/${id}/`)
        .then(res => { setEvent(res.data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
        toast.error('برای خرید بلیط ابتدا وارد شوید');
        setTimeout(() => router.push('/login'), 1500);
        return;
    }

    setPurchasing(true);
    const token = localStorage.getItem('access_token');

    try {
        await axios.post('http://127.0.0.1:8000/api/purchase/', 
            { event_id: event.id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('خرید با موفقیت انجام شد! بلیت صادر شد.');
        setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
        console.error(err);
        if (err.response?.status === 400) {
            toast.error(err.response.data.error || 'ظرفیت تکمیل است یا قبلاً خریده‌اید');
        } else {
            toast.error('خطا در ارتباط با سرور');
        }
    } finally {
        setPurchasing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">در حال بارگذاری...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center text-red-500">رویداد یافت نشد!</div>;

  // --- 1. اصلاح آدرس تصویر رویداد ---
  let imageUrl = event.image;
  if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `http://127.0.0.1:8000${imageUrl}`;
  }
  const displayImage = imageUrl || "https://placehold.co/1200x600";

  // --- 2. استخراج اطلاعات مدرس و دسته‌بندی ---
  const lecturer = event.lecturer_details || {};
  const categoryTitle = event.category_details ? event.category_details.title : 'عمومی';

  // اصلاح آدرس تصویر مدرس
  let lecturerImage = lecturer.image;
  if (lecturerImage && !lecturerImage.startsWith('http')) {
      lecturerImage = `http://127.0.0.1:8000${lecturerImage}`;
  }
  const displayLecturerImage = lecturerImage || "https://placehold.co/200x200?text=Coach";

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20">
      <Toaster position="top-center" />
      <Header />

      {/* هدر عکس بزرگ */}
      <div className="relative h-[400px] w-full group">
        <img src={displayImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={event.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12 text-white">
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-600/30">
                  {categoryTitle}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <UserIcon className="w-3 h-3"/>
                    {lecturer.name || 'مدرس نامشخص'}
                </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight max-w-4xl drop-shadow-lg">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium opacity-90">
              <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm"><CalendarIcon className="w-5 h-5 text-blue-400"/> {new Date(event.start_time).toLocaleDateString('fa-IR', { dateStyle: 'long' })}</span>
              <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm"><MapPinIcon className="w-5 h-5 text-red-400"/> {event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ستون اصلی (راست) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* کارت توضیحات */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-800 border-r-4 border-blue-600 pr-3">درباره رویداد</h2>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition"><ShareIcon className="w-5 h-5 text-gray-600"/></button>
                    <button className="p-2 bg-gray-50 rounded-full hover:bg-red-50 transition"><HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500"/></button>
                </div>
            </div>
            <p className="text-gray-600 leading-8 text-justify whitespace-pre-line text-lg">
              {event.description}
            </p>
          </div>

          {/* --- بخش جدید: معرفی مدرس --- */}
          {lecturer.name && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-black text-gray-800">درباره مدرس</h2>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative">
                        <img 
                            src={displayLecturerImage} 
                            className="w-full h-full object-cover rounded-full border-4 border-blue-50 shadow-md"
                            alt={lecturer.name}
                        />
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                            <UserIcon className="w-4 h-4" />
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{lecturer.name}</h3>
                        <p className="text-blue-600 text-sm font-bold mb-4 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                            {lecturer.specialty}
                        </p>
                        <p className="text-gray-500 text-sm leading-7 text-justify">
                            {lecturer.bio || "بیوگرافی برای این مدرس ثبت نشده است."}
                        </p>
                    </div>
                </div>
            </div>
          )}

        </div>

        {/* سایدبار (چپ) - باکس خرید */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
            <div className="mb-6 pb-6 border-b border-gray-50">
                <span className="block text-gray-400 text-sm mb-1">قیمت نهایی بلیت</span>
                <div className="flex items-center gap-1">
                    <span className="text-3xl font-black text-blue-600">{Number(event.price).toLocaleString()}</span>
                    <span className="text-gray-500 font-bold text-sm mt-2">تومان</span>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 text-gray-600">
                        <ClockIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold">ساعت</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dir-ltr">
                        {new Date(event.start_time).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 text-gray-600">
                        <TicketIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold">ظرفیت</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{event.capacity} نفر</span>
                </div>
            </div>

            <button 
                onClick={handlePurchase}
                disabled={purchasing}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                    purchasing 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-blue-600/40'
                }`}
            >
                {purchasing ? 'در حال پردازش...' : 'خرید بلیت و شرکت'}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 leading-5">
                با خرید بلیت، قوانین و مقررات رویداد را می‌پذیرید.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}