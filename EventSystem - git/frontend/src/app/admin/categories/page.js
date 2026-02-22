"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCats = () => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => {
          setCategories(res.data);
          setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); // جلوگیری از رفرش شدن صفحه

    // --- اصلاح ۱: اگر خالی بود پیام بده ---
    if(!newCat.trim()) {
        toast.error('لطفاً نام دسته‌بندی را بنویسید');
        return;
    }
    
    const token = localStorage.getItem('access_token');
    try {
        await axios.post('http://127.0.0.1:8000/api/categories/', 
            { title: newCat }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('دسته‌بندی افزوده شد');
        setNewCat('');
        fetchCats();
    } catch(err) { 
        console.error(err);
        toast.error('خطا در افزودن. شاید نام تکراری است؟'); 
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('با حذف دسته‌بندی، رویدادهای آن بدون دسته می‌شوند. ادامه می‌دهید؟')) return;
    const token = localStorage.getItem('access_token');
    try {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('حذف شد');
        fetchCats();
    } catch(err) { toast.error('خطا در حذف'); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black text-gray-800 mb-8">مدیریت دسته‌بندی‌ها</h1>
      
      {/* --- اصلاح ۲: افزودن relative z-10 به فرم ---
         این کلاس باعث می‌شود دکمه بالاتر از همه لایه‌ها قرار بگیرد و حتماً کلیک شود 
      */}
      <form onSubmit={handleAdd} className="relative z-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-8">
        <input 
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 transition"
            placeholder="نام دسته‌بندی جدید (مثلاً: همایش‌های علمی)"
        />
        {/* این دکمه به فرم بالا دستور می‌دهد */}
        <button type="submit" className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            افزودن
        </button>
      </form>

      {/* لیست */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? <div className="p-8 text-center text-gray-500">در حال بارگذاری...</div> : (
            <div className="divide-y divide-gray-50">
                {categories.map(cat => (
                    <div key={cat.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
                        <span className="font-bold text-gray-700">{cat.title}</span>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {categories.length === 0 && <p className="p-8 text-center text-gray-400">هنوز دسته‌بندی تعریف نشده است.</p>}
            </div>
        )}
      </div>
    </div>
  );
}