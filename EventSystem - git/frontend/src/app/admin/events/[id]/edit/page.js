"use client";
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PhotoIcon, UserCircleIcon, TagIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function EditEvent({ params }) {
  // باز کردن پارامترهای آدرس (ID رویداد)
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [lecturers, setLecturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    lecturer: '',
    location: '',
    price: '',
    capacity: '',
    start_time: '',
    description: '',
    image: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // دریافت لیست‌ها
        const [catsRes, lecsRes, eventRes] = await Promise.all([
           axios.get('http://127.0.0.1:8000/api/categories/'),
           axios.get('http://127.0.0.1:8000/api/lecturers/'),
           axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`)
        ]);

        setCategories(catsRes.data);
        setLecturers(lecsRes.data);

        const data = eventRes.data;
        
        // تنظیم مقادیر اولیه فرم
        setFormData({
            title: data.title,
            // نکته مهم: چون در سریالایزر category فقط نوشتنی بود، اینجا باید از category_details آی‌دی را برداریم
            category: data.category_details?.id || '', 
            lecturer: data.lecturer_details?.id || '',
            location: data.location,
            price: data.price,
            capacity: data.capacity,
            // تنظیم فرمت تاریخ برای اینپوت
            start_time: data.start_time ? data.start_time.slice(0, 16) : '', 
            description: data.description,
            image: null // عکس جدید فعلاً نداریم
        });

        if(data.image) setImagePreview(data.image);
        setLoading(false);

      } catch (err) {
        console.error(err);
        toast.error('خطا در دریافت اطلاعات رویداد');
        router.push('/admin/events');
      }
    };

    fetchData();
  }, [eventId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    if (formData.lecturer) data.append('lecturer', formData.lecturer);
    data.append('location', formData.location);
    data.append('price', formData.price);
    data.append('capacity', formData.capacity);
    data.append('start_time', formData.start_time);
    data.append('description', formData.description);
    
    // فقط اگر عکس جدید انتخاب شده باشد آن را می‌فرستیم
    if (formData.image instanceof File) {
        data.append('image', formData.image);
    }

    const token = localStorage.getItem('access_token');

    try {
      // استفاده از PATCH برای ویرایش
      await axios.patch(`http://127.0.0.1:8000/api/events/${eventId}/`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('رویداد ویرایش شد');
      router.push('/admin/events');
    } catch (err) {
      console.error(err);
      toast.error('خطا در ویرایش');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">در حال بارگذاری اطلاعات...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2">
        <ArrowPathIcon className="w-6 h-6 text-blue-600"/>
        ویرایش رویداد
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ستون چپ: عکس */}
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center sticky top-8">
                <label className="cursor-pointer block relative group">
                    <div className="aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50">
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <div className="text-gray-400">
                                <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                                <span className="text-sm font-bold">تغییر تصویر</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-2xl">
                            <span className="text-white font-bold text-sm">تغییر تصویر</span>
                        </div>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>
        </div>

        {/* ستون راست: فرم */}
        <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان رویداد</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی</label>
                    <div className="relative">
                        <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none appearance-none">
                            <option value="">انتخاب...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                        <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">مدرس</label>
                    <div className="relative">
                        <select name="lecturer" value={formData.lecturer} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none appearance-none">
                            <option value="">انتخاب...</option>
                            {lecturers.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                        <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">قیمت</label>
                    <input required name="price" type="number" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ظرفیت</label>
                    <input required name="capacity" type="number" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">مکان</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">زمان شروع</label>
                    <input required name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-right" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات</label>
                <textarea required name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none"></textarea>
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {submitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
        </div>
      </form>
    </div>
  );
}