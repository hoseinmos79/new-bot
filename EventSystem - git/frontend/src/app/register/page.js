"use client";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('نام کاربری الزامی است').min(4, 'حداقل ۴ کاراکتر'),
      email: Yup.string().email('ایمیل معتبر نیست'),
      password: Yup.string().required('رمز عبور الزامی است').min(6, 'حداقل ۶ کاراکتر'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'رمز عبور مطابقت ندارد')
        .required('تکرار رمز عبور الزامی است'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://127.0.0.1:8000/api/register/', {
            username: values.username,
            password: values.password,
            email: values.email
        });
        toast.success('ثبت‌نام با موفقیت انجام شد! حالا وارد شوید.');
        setTimeout(() => router.push('/login'), 2000);
      } catch (err) {
        toast.error('خطا در ثبت‌نام. ممکن است نام کاربری تکراری باشد.');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <Toaster position="top-center" />
      
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">ساخت حساب جدید</h1>
            <p className="text-gray-500 text-sm">به جمع کاربران ایوند پرو بپیوندید</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نام کاربری</label>
                <input
                    type="text"
                    {...formik.getFieldProps('username')}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition"
                />
                {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ایمیل (اختیاری)</label>
                <input
                    type="email"
                    {...formik.getFieldProps('email')}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition"
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رمز عبور</label>
                <input
                    type="password"
                    {...formik.getFieldProps('password')}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition"
                />
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تکرار رمز عبور</label>
                <input
                    type="password"
                    {...formik.getFieldProps('confirmPassword')}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
            >
                ثبت‌نام
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
                وارد شوید
            </Link>
        </div>
      </div>
    </div>
  );
}