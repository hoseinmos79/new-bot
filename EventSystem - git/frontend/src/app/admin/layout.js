"use client";
import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!user.is_staff && !user.is_superuser) {
        router.push('/'); 
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-gray-900 transition-colors duration-300" dir="rtl">
      <Toaster position="top-center" />
      <AdminSidebar />
      <div className="md:mr-64 p-8 transition-all">
        {children}
      </div>
    </div>
  );
}