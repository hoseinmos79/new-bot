"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  BanknotesIcon, 
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  TagIcon,          
  AcademicCapIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'داشبورد', href: '/admin', icon: ChartBarIcon },
    { name: 'مدیریت رویدادها', href: '/admin/events', icon: CalendarDaysIcon },
    { name: 'کاربران', href: '/admin/users', icon: UsersIcon },
    { name: 'تراکنش‌ها', href: '/admin/transactions', icon: BanknotesIcon },
    { name: 'دسته‌بندی‌ها', href: '/admin/categories', icon: TagIcon },
    { name: 'مدرسین', href: '/admin/lecturers', icon: AcademicCapIcon },
    { name: 'تنظیمات', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen fixed right-0 top-0 border-l border-gray-100 dark:border-gray-700 hidden md:flex flex-col z-40 transition-colors">
      <div className="h-20 flex items-center justify-center border-b border-gray-50 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-gray-800 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center">A</div>
            <span>پنل مدیریت</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50 dark:border-gray-700">
        <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm transition"
        >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            بازگشت به سایت
        </Link>
      </div>
    </aside>
  );
}