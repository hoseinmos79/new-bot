"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    axios.get('http://127.0.0.1:8000/api/admin/users/', {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
          setUsers(res.data);
          setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">در حال دریافت لیست کاربران...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-800 mb-8">مدیریت کاربران</h1>
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                    <th className="p-4">شناسه</th>
                    <th className="p-4">نام کاربری</th>
                    <th className="p-4">ایمیل</th>
                    <th className="p-4">تاریخ عضویت</th>
                    <th className="p-4">عملیات</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-400">#{user.id}</td>
                        <td className="p-4 font-bold text-gray-800">{user.username}</td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4 text-sm text-gray-500">
                            {new Date(user.date_joined).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="p-4">
                            <Link href={`/admin/users/${user.id}`} className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition flex items-center gap-2 w-fit">
                                <EyeIcon className="w-4 h-4" />
                                جزئیات
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}