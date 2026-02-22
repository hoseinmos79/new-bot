"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PhotoIcon, UserCircleIcon, TagIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// ایمپورت‌های تقویم شمسی
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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
    start_time: new Date().toISOString(), // مقدار پیش‌فرض زمان حال
    description: '',
    image: null
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/lecturers/')
      .then(res => setLecturers(res.data))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

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
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    if (formData.lecturer) data.append('lecturer', formData.lecturer);
    data.append('location', formData.location);
    data.append('price', formData.price);
    data.append('capacity', formData.capacity);
    data.append('start_time', formData.start_time);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);
    data.append('is_active', 'true');

    const token = localStorage.getItem('access_token');

    try {
      await axios.post('http://127.0.0.1:8000/api/events/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('رویداد با موفقیت ساخته شد!');
      router.push('/admin/events');
    } catch (err) {
      console.error(err);
      if(err.response?.data) {
        const messages = Object.entries(err.response.data).map(([k,v]) => `${k}: ${v}`).join(' | ');
        toast.error(`خطا: ${messages}`);
      } else {
        toast.error('خطا در ارتباط با سرور');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-gray-800 mb-8">افزودن رویداد جدید</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center sticky top-8">
                <label className="cursor-pointer block relative group">
                    <div className={`aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden ${!imagePreview ? 'bg-gray-50' : ''}`}>
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <div className="text-gray-400 group-hover:text-blue-500 transition">
                                <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                                <span className="text-sm font-bold">انتخاب تصویر</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-2xl">
                            <span className="text-white font-bold text-sm">تغییر تصویر</span>
                        </div>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                <p className="text-xs text-gray-400 mt-4">فرمت‌های مجاز: JPG, PNG</p>
            </div>
        </div>

        <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان رویداد</label>
                <input required name="title" onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" placeholder="مثلاً: کارگاه آموزش ریکت" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی</label>
                    <div className="relative">
                        <select required name="category" onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none appearance-none">
                            <option value="">انتخاب کنید...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                        <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                    {categories.length === 0 && <p className="text-xs text-red-500 mt-1">ابتدا دسته‌بندی بسازید!</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">مدرس</label>
                    <div className="relative">
                        <select name="lecturer" onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none appearance-none">
                            <option value="">انتخاب کنید...</option>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">قیمت (تومان)</label>
                    <input required name="price" onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" placeholder="0" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ظرفیت (نفر)</label>
                    <input required name="capacity" onChange={handleChange} type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" placeholder="50" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">مکان برگزاری</label>
                    <input required name="location" onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" placeholder="تهران، ..." />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">زمان شروع (تقویم شمسی)</label>
                    {/* تقویم بازشونده جایگزین شد */}
                    <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD HH:mm"
                        plugins={[<TimePicker position="bottom" />]}
                        value={formData.start_time ? new Date(formData.start_time) : new Date()}
                        onChange={(date) => {
                            if (date) {
                                setFormData({ ...formData, start_time: date.toDate().toISOString() });
                            }
                        }}
                        containerClassName="w-full"
                        inputClass="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none text-left font-mono"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات کامل</label>
                <textarea required name="description" onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" placeholder="توضیحات رویداد..."></textarea>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300'}`}
            >
                {loading ? 'در حال ثبت...' : 'انتشار رویداد'}
            </button>

        </div>
      </form>
    </div>
  );
}