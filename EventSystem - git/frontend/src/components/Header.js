"use client";
import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 cursor-pointer select-none">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">E</div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900">ایوند<span className="text-blue-600">پرو</span></h1>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-bold text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition">صفحه اصلی</Link>
              <Link href="/contact" className="hover:text-blue-600 transition">تماس با ما</Link>
              {/* ✅ لینک پنل مدیریت فقط برای ادمین */}
              {user && (user.is_staff || user.is_superuser) && (
                <Link href="/admin" className="hover:text-purple-600 text-purple-500 transition flex items-center gap-1">
                  <Cog6ToothIcon className="w-4 h-4" />
                  پنل مدیریت
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-gray-700 font-bold bg-gray-100 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
                  <UserCircleIcon className="w-6 h-6 text-blue-600" />
                  <span className="text-sm truncate max-w-[150px]">{user.username}</span>
                </Link>
                <button onClick={logout} className="bg-red-50 text-red-600 px-3 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition flex items-center gap-2">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="hidden md:inline">خروج</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-gray-600 hover:text-gray-900 font-bold text-sm px-4 py-2">ورود</Link>
                <Link href="/register" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-md">ثبت‌نام</Link>
              </>
            )}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ موبایل منو کامل شد */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 shadow-lg absolute w-full">
          <Link href="/" className="block font-bold text-gray-700 py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>صفحه اصلی</Link>
          <Link href="/contact" className="block font-medium text-gray-600 py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>تماس با ما</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block font-bold text-blue-600 py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>داشبورد من</Link>
              {(user.is_staff || user.is_superuser) && (
                <Link href="/admin" className="block font-bold text-purple-600 py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>پنل مدیریت</Link>
              )}
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-right font-bold text-red-500 py-2">خروج</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block font-bold text-gray-700 py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>ورود</Link>
              <Link href="/register" className="block font-bold text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>ثبت‌نام</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
