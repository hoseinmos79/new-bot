import Link from 'next/link';
import { MapPinIcon, UserIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function EventCard({ event }) {
  
  // 1. درست کردن آدرس عکس
  // اگر عکس وجود داشت ولی آدرس کامل نداشت، آدرس سرور را به اولش اضافه کن
  let imageUrl = event.image; // فیلد عکس در مدل جدید image است نه image_url
  if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `http://127.0.0.1:8000${imageUrl}`;
  }
  const displayImage = imageUrl || "https://placehold.co/600x400?text=No+Image";

  // 2. استخراج اطلاعات از جزئیات (Details)
  // چون category الان یک عدد است، باید عنوان را از category_details برداریم
  const categoryTitle = event.category_details ? event.category_details.title : 'دسته‌بندی نشده';
  
  // چون lecturer الان یک عدد است، باید نام را از lecturer_details برداریم
  const lecturerName = event.lecturer_details ? event.lecturer_details.name : 'مدرس نامشخص';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* بخش تصویر */}
      <div className="relative h-52 w-full">
        <img 
          src={displayImage} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* نمایش دسته‌بندی درست */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold">
          {categoryTitle}
        </div>

        <button className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white border border-white/20 rounded-full transition-all text-white hover:text-red-500">
          <HeartIcon className="w-5 h-5" />
        </button>
      </div>

      {/* بخش محتوا */}
      <div className="p-5">
        <h3 className="font-black text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <UserIcon className="w-4 h-4 text-gray-300" />
            {/* نمایش نام مدرس درست */}
            <span>مدرس: {lecturerName}</span>
        </div>

        <div className="border-t border-gray-50 my-4"></div>

        <div className="flex justify-between items-center">
            <div>
                <span className="block text-xs text-gray-400 mb-1">قیمت بلیت</span>
                <span className="text-lg font-black text-gray-800">
                    {Number(event.price).toLocaleString()} <span className="text-xs font-normal text-gray-500">تومان</span>
                </span>
            </div>

            <Link href={`/events/${event.id}`}>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-400 transition-all flex items-center gap-2">
                    ثبت نام
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                </button>
            </Link>
        </div>
      </div>
    </div>
  );
}