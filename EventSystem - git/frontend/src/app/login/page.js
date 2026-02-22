"use client";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const { login } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('لطفا نام کاربری را وارد کنید'),
      password: Yup.string().required('لطفا رمز عبور را وارد کنید'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${API_URL}/api/token/`, values);
        toast.success('با موفقیت وارد شدید!');
        login(res.data.access, res.data.refresh);
      } catch (err) {
        toast.error('نام کاربری یا رمز عبور اشتباه است.');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Toaster position="top-center" />
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">ورود به حساب</h1>
          <p className="text-gray-500 text-sm">برای خرید بلیت وارد شوید</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نام کاربری</label>
            <input
              type="text"
              {...formik.getFieldProps('username')}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition"
              placeholder="نام کاربری خود را وارد کنید"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              {...formik.getFieldProps('password')}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition"
              placeholder="رمز عبور خود را وارد کنید"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            ورود
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          حساب کاربری ندارید؟{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
