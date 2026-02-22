"use client";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { CalendarIcon, MapPinIcon, QrCodeIcon, TicketIcon, UserIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; 
import QRCode from "react-qr-code";
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('tickets'); 
  const [tickets, setTickets] = useState([]);
  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '', username: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null);

  // تابع تبدیل تاریخ به شمسی با ساعت
  const formatJalali = (dateString) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('fa-IR', { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    }).format(new Date(dateString));
  };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [ticketsRes, profileRes] = await Promise.all([
                    axios.get(`${API_URL}/api/my-tickets/`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_URL}/api/profile/`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setTickets(ticketsRes.data);
                setProfile(profileRes.data);
            } catch (err) {
                console.error(err);
                toast.error('خطا در دریافت اطلاعات');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('access_token');
        try {
            await axios.put(`${API_URL}/api/profile/`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('اطلاعات پروفایل با موفقیت بروزرسانی شد');
        } catch (err) {
            toast.error('خطا در بروزرسانی اطلاعات');
        }
        setSaving(false);
    };


  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#F3F4F6]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6]" dir="rtl">
      <Header />
      <Toaster position="top-center" />
      
      <main className="max-w-4xl mx-auto px-4 py-10">
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">
                        {profile.first_name ? profile.first_name[0] : <UserIcon className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">{profile.first_name || profile.last_name
                        ? `${profile.first_name} ${profile.last_name}`.trim()
                        : 'کاربر عزیز'}</h1>
                        <p className="text-gray-500 text-sm">به پنل کاربری خود خوش آمدید</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('tickets')}
                        className={`flex-1 md:w-32 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'tickets' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <TicketIcon className="w-5 h-5" />
                        بلیط‌ها
                    </button>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 md:w-32 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <UserIcon className="w-5 h-5" />
                        پروفایل من
                    </button>
                </div>
            </div>
        </div>

        {activeTab === 'tickets' && (
            <div>
                {tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <TicketIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-4 font-medium">شما هنوز در رویدادی ثبت‌نام نکرده‌اید.</p>
                        <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">مشاهده رویدادها</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition">
                                <img 
                                    src={ticket.event.image ? (ticket.event.image.startsWith('http') ? ticket.event.image : `${API_URL}${ticket.event.image}`) : "https://placehold.co/200x200"} 
                                    className="w-full md:w-48 h-32 object-cover rounded-2xl" 
                                    alt={ticket.event.title} 
                                />
                                
                                <div className="flex-1 w-full text-center md:text-right">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{ticket.event.title}</h2>
                                    <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-500 mb-4 justify-center md:justify-start">
                                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg text-blue-700 font-bold"><CalendarIcon className="w-4 h-4 text-blue-600"/> {formatJalali(ticket.event.start_time)}</span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg"><MapPinIcon className="w-4 h-4 text-red-500"/> {ticket.event.location}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono">کد رهگیری: {ticket.ticket_code.split('-')[0]}...</div>
                                    <div className="text-xs text-gray-400 mt-1 mb-3">تاریخ خرید: {formatJalali(ticket.purchase_date)}</div>

                                    {/* نمایش وضعیت حضور به کاربر اضافه شد */}
                                    {ticket.is_checked_in ? (
                                        <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-lg text-xs font-bold mt-2">
                                            <CheckCircleIcon className="w-4 h-4" /> شما در این رویداد شرکت کردید
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold mt-2">
                                            <ClockIcon className="w-4 h-4" /> در انتظار برگزاری
                                        </span>
                                    )}
                                </div>

                                <button 
                                    onClick={() => setSelectedTicket(ticket)}
                                    className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg shadow-gray-900/20"
                                >
                                    <QrCodeIcon className="w-5 h-5" />
                                    نمایش بلیط
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">اطلاعات شخصی</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">نام</label>
                            <input 
                                type="text" 
                                value={profile.first_name}
                                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition bg-gray-50 focus:bg-white"
                                placeholder="مثال: علی"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">نام خانوادگی</label>
                            <input 
                                type="text" 
                                value={profile.last_name}
                                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition bg-gray-50 focus:bg-white"
                                placeholder="مثال: محمدی"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">ایمیل</label>
                        <input 
                            type="email" 
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition bg-gray-50 focus:bg-white text-left"
                            dir="ltr"
                            placeholder="ali@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">نام کاربری (غیرقابل تغییر)</label>
                        <input 
                            type="text" 
                            value={profile.username}
                            disabled
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-left cursor-not-allowed"
                            dir="ltr"
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <button 
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>
        )}
      </main>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
            <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedTicket.event.title}</h3>
                <p className="text-gray-500 text-sm mb-6">این کد را هنگام ورود به مسئول سالن نشان دهید</p>
                
                <div className="bg-white p-4 border-2 border-dashed border-gray-200 rounded-2xl inline-block mb-6">
                    <QRCode 
                        value={selectedTicket.ticket_code} 
                        size={200}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                
                <div className="text-xs font-mono text-gray-400 mb-6 bg-gray-50 p-2 rounded-lg break-all">
                    {selectedTicket.ticket_code}
                </div>

                <button 
                    onClick={() => setSelectedTicket(null)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    بستن
                </button>
            </div>
        </div>
      )}
    </div>
  );
}