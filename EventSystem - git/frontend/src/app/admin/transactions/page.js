"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    MagnifyingGlassIcon, 
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at'); // پیش‌فرض: جدیدترین

    // تابع دریافت اطلاعات
    const fetchTransactions = (searchQuery = '', orderQuery = '-created_at') => {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        // ساخت پارامترهای URL
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (orderQuery) params.append('ordering', orderQuery);

        axios.get(`http://127.0.0.1:8000/api/payments/list/?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setTransactions(res.data); // اگر pagination دارید شاید res.data.results باشد
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchTransactions(search, ordering);
    }, [ordering]); // وقتی نحوه مرتب‌سازی عوض شد، دوباره بگیر

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTransactions(search, ordering);
    };

    const toggleSort = (field) => {
        // تغییر جهت سورت (صعودی/نزولی)
        if (ordering === field) {
            setOrdering(`-${field}`);
        } else {
            setOrdering(field);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-black text-gray-800">تراکنش‌های مالی</h1>
                
                {/* بخش جستجو */}
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="جستجو (نام، کد پیگیری...)" 
                        className="input input-bordered w-full md:w-64 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary rounded-xl text-white">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => fetchTransactions(search, ordering)} className="btn btn-ghost btn-circle">
                        <ArrowPathIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-20 flex justify-center items-center gap-2 text-gray-500">
                    <span className="loading loading-spinner loading-md"></span>
                    در حال دریافت لیست تراکنش‌ها...
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">هیچ تراکنشی یافت نشد!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* هدر جدول */}
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm">
                                <th>#</th>
                                <th>کاربر</th>
                                <th className="cursor-pointer hover:text-primary transition" onClick={() => toggleSort('amount')}>
                                    <div className="flex items-center gap-1">
                                        مبلغ (تومان)
                                        <ArrowsUpDownIcon className="w-3 h-3" />
                                    </div>
                                </th>
                                <th>کد پیگیری (RefID)</th>
                                <th>توضیحات</th>
                                <th className="cursor-pointer hover:text-primary transition" onClick={() => toggleSort('created_at')}>
                                    <div className="flex items-center gap-1">
                                        تاریخ
                                        <ArrowsUpDownIcon className="w-3 h-3" />
                                    </div>
                                </th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((trx, index) => (
                                <tr key={trx.id} className="hover:bg-gray-50 transition border-b border-gray-100">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="font-bold text-gray-700">{trx.user_full_name}</div>
                                        <div className="text-xs text-gray-400">ID: {trx.user}</div>
                                    </td>
                                    <td className="font-mono text-lg font-black text-gray-800">
                                        {Number(trx.amount).toLocaleString('fa-IR')}
                                    </td>
                                    <td>
                                        {trx.ref_id ? (
                                            <span className="badge badge-ghost font-mono dir-ltr">{trx.ref_id}</span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                    <td className="text-sm text-gray-500 max-w-xs truncate">
                                        {trx.description || '-'}
                                    </td>
                                    <td className="dir-ltr text-xs text-gray-500">
                                        {new Date(trx.created_at).toLocaleString('fa-IR')}
                                    </td>
                                    <td>
                                        {trx.is_successful ? (
                                            <div className="badge badge-success gap-1 text-white py-3 px-4">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                موفق
                                            </div>
                                        ) : (
                                            <div className="badge badge-error gap-1 text-white py-3 px-4">
                                                <XCircleIcon className="w-4 h-4" />
                                                ناموفق
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}