"use client";
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { UserIcon, TicketIcon, BanknotesIcon, CalendarIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function UserProfile({ params }) {
    const { id } = use(params);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/admin/users/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
                setUserData(res.data);
            } catch (err) { 
                toast.error('خطا در دریافت اطلاعات کاربر'); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <div className="text-center py-20">در حال بارگذاری...</div>;
    if (!userData) return <div className="text-center py-20 text-red-500">کاربر یافت نشد.</div>;

    const { user_info, stats, tickets } = userData;

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/users" className="bg-white p-2 rounded-xl shadow-sm hover:bg-gray-50 transition border">
                    <ArrowRightIcon className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-black text-gray-800">سوابق کاربری: {user_info.first_name} {user_info.last_name}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><UserIcon className="w-8 h-8"/></div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold">شماره تماس (نام کاربری)</p>
                        <p className="text-xl font-black text-gray-900 font-mono mt-1">{user_info.username}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><TicketIcon className="w-8 h-8"/></div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold">تعداد رویدادهای ثبت‌نامی</p>
                        <p className="text-xl font-black text-gray-900 mt-1">{stats.total_tickets} رویداد</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border flex items-center gap-4">
                    <div className="bg-green-50 p-4 rounded-2xl text-green-600"><BanknotesIcon className="w-8 h-8"/></div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold">مجموع پرداختی</p>
                        <p className="text-xl font-black text-green-600 mt-1">{stats.total_spent.toLocaleString()} تومان</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">تاریخچه حضور در رویدادها</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-100 text-gray-500 text-sm border-b">
                            <tr>
                                <th className="p-4">رویداد</th>
                                <th className="p-4">مبلغ (تومان)</th>
                                <th className="p-4">تاریخ خرید</th>
                                <th className="p-4 text-center">وضعیت حضور در سالن</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border">
                                            {ticket.event_image ? <img src={ticket.event_image} className="w-full h-full object-cover" /> : <TicketIcon className="w-5 h-5 m-2 text-gray-400"/>}
                                        </div>
                                        {ticket.event_title}
                                    </td>
                                    <td className="p-4 font-mono text-sm">{parseInt(ticket.price).toLocaleString()}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        <CalendarIcon className="w-4 h-4 inline ml-1"/>
                                        {ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleDateString('fa-IR') : '-'}
                                    </td>
                                    <td className="p-4 text-center">
                                        {ticket.is_checked_in ? (
                                            <span className="inline-flex bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                                                <CheckCircleIcon className="w-5 h-5 ml-1" /> حاضر شده
                                            </span>
                                        ) : (
                                            <span className="inline-flex bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-sm font-bold">
                                                <XCircleIcon className="w-5 h-5 ml-1" /> غایب (یا در انتظار)
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400">هیچ بلیطی وجود ندارد.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}