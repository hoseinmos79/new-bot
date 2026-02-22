"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, UserIcon, PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // استیت فرم
  const [formData, setFormData] = useState({ name: '', specialty: '', bio: '', image: null });

  const fetchLecturers = () => {
    axios.get('http://127.0.0.1:8000/api/lecturers/')
      .then(res => { setLecturers(res.data); setLoading(false); })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchLecturers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('specialty', formData.specialty);
    data.append('bio', formData.bio);
    if(formData.image) data.append('image', formData.image);

    try {
        await axios.post('http://127.0.0.1:8000/api/lecturers/', data, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.success('مدرس با موفقیت اضافه شد');
        setFormData({ name: '', specialty: '', bio: '', image: null }); // ریست فرم
        fetchLecturers();
    } catch(err) { toast.error('خطا در ثبت مدرس'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('مدرس حذف شود؟')) return;
    const token = localStorage.getItem('access_token');
    try {
        await axios.delete(`http://127.0.0.1:8000/api/lecturers/${id}/`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchLecturers();
        toast.success('حذف شد');
    } catch(err) { toast.error('خطا'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* ستون چپ: فرم افزودن (4 واحد) */}
      <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-blue-600"/>
                  افزودن مدرس جدید
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} 
                    placeholder="نام و نام خانوادگی" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500" required 
                  />
                  <input 
                    value={formData.specialty} onChange={e=>setFormData({...formData, specialty: e.target.value})} 
                    placeholder="تخصص (مثلاً: متخصص هوش مصنوعی)" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500" required 
                  />
                  <textarea 
                    value={formData.bio} onChange={e=>setFormData({...formData, bio: e.target.value})} 
                    placeholder="بیوگرافی کوتاه..." rows="3" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500" required 
                  />
                  
                  <label className="block p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer text-center text-gray-500 text-sm hover:bg-gray-100 transition">
                      {formData.image ? `تصویر انتخاب شد: ${formData.image.name}` : 'انتخاب تصویر پروفایل'}
                      <input type="file" className="hidden" accept="image/*" onChange={e=>setFormData({...formData, image: e.target.files[0]})} />
                  </label>

                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                      ثبت مدرس
                  </button>
              </form>
          </div>
      </div>

      {/* ستون راست: لیست مدرسین (8 واحد) */}
      <div className="lg:col-span-8 order-1 lg:order-2">
          <h2 className="text-2xl font-black text-gray-800 mb-6">لیست مدرسین</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lecturers.map(l => (
                  <div key={l.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                      <img src={l.image || "https://placehold.co/100x100"} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                      <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{l.name}</h3>
                          <p className="text-xs text-blue-600 font-bold mb-1">{l.specialty}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{l.bio}</p>
                      </div>
                      <button onClick={() => handleDelete(l.id)} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition">
                          <TrashIcon className="w-5 h-5"/>
                      </button>
                  </div>
              ))}
              {lecturers.length === 0 && <p className="text-gray-400">هنوز مدرسی اضافه نشده است.</p>}
          </div>
      </div>

    </div>
  );
}