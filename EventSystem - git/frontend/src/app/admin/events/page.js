"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  PlusIcon, 
  TrashIcon, 
  MapPinIcon, 
  CalendarIcon,
  PencilSquareIcon,
  QrCodeIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    axios.get('http://127.0.0.1:8000/api/events/')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این رویداد مطمئن هستید؟')) return;
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/events/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('رویداد حذف شد');
      fetchEvents();
    } catch (err) {
      toast.error('خطا در حذف رویداد');
    }
  };

  // تابع تبدیل تاریخ به فرمت زیبای شمسی با ساعت
  const formatJalali = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('fa-IR', { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateString));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">در حال بارگذاری...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800">مدیریت رویدادها</h1>
        <Link href="/admin/events/create" className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          <PlusIcon className="w-5 h-5" />
          <span>رویداد جدید</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4">تصویر</th>
              <th className="p-4">عنوان</th>
              <th className="p-4">قیمت</th>
              <th className="p-4">زمان</th>
              <th className="p-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.map(event => (
              <tr key={event.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={event.image || "https://placehold.co/100x100"} className="w-16 h-16 rounded-xl object-cover border border-gray-100" alt={event.title} />
                </td>
                <td className="p-4 font-bold text-gray-800">{event.title}</td>
                <td className="p-4 text-blue-600 font-bold">{parseInt(event.price).toLocaleString()} تومان</td>
                <td className="p-4 text-sm text-gray-500">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 font-bold text-blue-700"><CalendarIcon className="w-4 h-4"/> {formatJalali(event.start_time)}</span>
                        <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4"/> {event.location}</span>
                    </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    
                    <Link href={`/admin/events/${event.id}/attendance`} title="حضور و غیاب / اسکن بارکد" className="text-green-600 bg-green-50 p-2 rounded-lg hover:bg-green-100 transition shadow-sm">
                        <QrCodeIcon className="w-5 h-5" />
                    </Link>

                    <Link href={`/admin/events/${event.id}/edit`} title="ویرایش رویداد" className="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition shadow-sm">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>

                    <button onClick={() => handleDelete(event.id)} title="حذف رویداد" className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition shadow-sm">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">هیچ رویدادی یافت نشد.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}