"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAppearanceLoaded, setIsAppearanceLoaded] = useState(false);

  // تمام فیلدها از جمله فیلدهای جدید تماس با ما به استیت اضافه شدند
  const [settings, setSettings] = useState({
    site_title: '',
    support_phones: '',
    contact_email: '',
    contact_address: '',
    about_us: '',
    active_gateway: 'zarinpal',
    zarinpal_merchant_id: '',
    mellat_terminal_id: '',
    mellat_username: '',
    mellat_password: '',
    active_sms_panel: 'kavehnegar',
    sms_sender_number: '',
    kavehnegar_api_key: '',
    melipayamak_username: '',
    melipayamak_password: ''
  });

  const [appearance, setAppearance] = useState({
    darkMode: false,
    themeColor: 'blue',
    font: 'system-ui'
  });

  const fontOptions = [
    { name: 'پیش‌فرض (Vazir)', value: 'var(--font-vazir)' },
    { name: 'کلاسیک (Tahoma)', value: 'Tahoma, sans-serif' },
    { name: 'گرد (Comic Sans)', value: '"Comic Sans MS", cursive' }
  ];

  // دریافت اطلاعات از بک‌اند و خواندن ظاهر از مرورگر
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/settings/')
      .then(res => {
        setSettings(res.data);
        setLoading(false);
      })
      .catch(() => toast.error('خطا در دریافت اطلاعات سیستم'));

    // خواندن ایمن تنظیمات ظاهر (حل مشکل پرش و ریست شدن)
    const savedApp = localStorage.getItem('adminAppearance');
    if (savedApp) {
      setAppearance(JSON.parse(savedApp));
    }
    setIsAppearanceLoaded(true);
  }, []);

  // اعمال و ذخیره ظاهر در لحظه
  useEffect(() => {
    if (isAppearanceLoaded) {
      if (appearance.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.body.style.fontFamily = appearance.font;
      localStorage.setItem('adminAppearance', JSON.stringify(appearance));
    }
  }, [appearance, isAppearanceLoaded]);

  // ذخیره در دیتابیس
  const handleSaveBackend = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://127.0.0.1:8000/api/settings/', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تنظیمات با موفقیت در سیستم ذخیره شد');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('نشست شما منقضی شده. لطفا دوباره لاگین کنید.');
      } else {
        toast.error('خطا در ذخیره‌سازی اطلاعات');
      }
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center mt-20 dark:text-white">در حال بارگذاری...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">تنظیمات سیستم و شخصی‌سازی</h1>

      <div className="flex space-x-reverse space-x-4 border-b border-gray-200 dark:border-gray-700 mb-8 pb-2">
        <button onClick={() => setActiveTab('general')} className={`pb-2 ${activeTab === 'general' ? 'border-b-2 border-blue-600 font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>عمومی و تماس</button>
        <button onClick={() => setActiveTab('api')} className={`pb-2 ${activeTab === 'api' ? 'border-b-2 border-blue-600 font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>درگاه و پیامک</button>
        <button onClick={() => setActiveTab('appearance')} className={`pb-2 ${activeTab === 'appearance' ? 'border-b-2 border-blue-600 font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>ظاهر پنل</button>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان سایت</label>
            <input 
              type="text" 
              value={settings.site_title || ''} 
              onChange={e => setSettings({...settings, site_title: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ایمیل ارتباطی</label>
            <input 
              type="email" 
              value={settings.contact_email || ''} 
              onChange={e => setSettings({...settings, contact_email: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-left" dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تلفن‌های پشتیبانی (هر شماره در یک خط)</label>
            <textarea 
              rows="3"
              value={settings.support_phones || ''} 
              onChange={e => setSettings({...settings, support_phones: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-left" dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">آدرس فیزیکی مجموعه</label>
            <textarea 
              rows="2"
              value={settings.contact_address || ''} 
              onChange={e => setSettings({...settings, contact_address: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">متن درباره ما</label>
            <textarea 
              rows="4"
              value={settings.about_us || ''} 
              onChange={e => setSettings({...settings, about_us: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button onClick={handleSaveBackend} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات عمومی'}
          </button>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-6 max-w-2xl">
          {/* بخش درگاه بانکی */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg border-b pb-2">تنظیمات درگاه بانکی</h3>
            <div className="mb-6">
              <label className="block text-sm mb-2 font-bold text-blue-600">انتخاب درگاه فعال جهت پرداخت کاربران:</label>
              <select 
                value={settings.active_gateway || 'zarinpal'} 
                onChange={e => setSettings({...settings, active_gateway: e.target.value})}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="zarinpal">زرین‌پال</option>
                <option value="mellat">به‌پرداخت ملت</option>
                <option value="saman">بانک سامان</option>
              </select>
            </div>

            {settings.active_gateway === 'zarinpal' && (
              <div className="space-y-4 animate-fade-in">
                <label className="block text-sm dark:text-gray-300">مرچنت کد زرین‌پال</label>
                <input type="text" value={settings.zarinpal_merchant_id || ''} onChange={e => setSettings({...settings, zarinpal_merchant_id: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
              </div>
            )}

            {settings.active_gateway === 'mellat' && (
              <div className="space-y-4 animate-fade-in">
                <label className="block text-sm dark:text-gray-300">ترمینال آیدی (Terminal ID)</label>
                <input type="text" value={settings.mellat_terminal_id || ''} onChange={e => setSettings({...settings, mellat_terminal_id: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
                <label className="block text-sm dark:text-gray-300">نام کاربری</label>
                <input type="text" value={settings.mellat_username || ''} onChange={e => setSettings({...settings, mellat_username: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
                <label className="block text-sm dark:text-gray-300">رمز عبور</label>
                <input type="password" value={settings.mellat_password || ''} onChange={e => setSettings({...settings, mellat_password: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
              </div>
            )}
          </div>

          {/* بخش پیامک */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg border-b pb-2">تنظیمات سامانه پیامکی</h3>
            <div className="mb-4">
              <label className="block text-sm mb-2 font-bold dark:text-gray-300">شماره خط فرستنده (برای همه پنل‌ها)</label>
              <input type="text" value={settings.sms_sender_number || ''} onChange={e => setSettings({...settings, sms_sender_number: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" placeholder="1000..." />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 font-bold text-blue-600">انتخاب پنل پیامک فعال:</label>
              <select 
                value={settings.active_sms_panel || 'kavehnegar'} 
                onChange={e => setSettings({...settings, active_sms_panel: e.target.value})}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="kavehnegar">کاوه نگار</option>
                <option value="melipayamak">ملی پیامک</option>
              </select>
            </div>

            {settings.active_sms_panel === 'kavehnegar' && (
              <div className="space-y-4 animate-fade-in">
                <label className="block text-sm dark:text-gray-300">کلید API کاوه‌نگار</label>
                <input type="text" value={settings.kavehnegar_api_key || ''} onChange={e => setSettings({...settings, kavehnegar_api_key: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
              </div>
            )}

            {settings.active_sms_panel === 'melipayamak' && (
              <div className="space-y-4 animate-fade-in">
                <label className="block text-sm dark:text-gray-300">نام کاربری ملی پیامک</label>
                <input type="text" value={settings.melipayamak_username || ''} onChange={e => setSettings({...settings, melipayamak_username: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
                <label className="block text-sm dark:text-gray-300">رمز عبور ملی پیامک</label>
                <input type="password" value={settings.melipayamak_password || ''} onChange={e => setSettings({...settings, melipayamak_password: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-left" dir="ltr" />
              </div>
            )}
          </div>

          <button onClick={handleSaveBackend} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full">ذخیره تنظیمات API</button>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-8 max-w-2xl">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-bold dark:text-white">حالت شب (Dark Mode)</h3>
            </div>
            <button 
              onClick={() => setAppearance({...appearance, darkMode: !appearance.darkMode})}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${appearance.darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${appearance.darkMode ? '-translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div>
            <h3 className="font-bold dark:text-white mb-4">فونت پنل مدیریت</h3>
            <div className="grid grid-cols-3 gap-4">
              {fontOptions.map(font => (
                <button
                  key={font.value}
                  onClick={() => setAppearance({...appearance, font: font.value})}
                  style={{ fontFamily: font.value }}
                  className={`p-4 border rounded-lg text-center transition-all ${appearance.font === font.value ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-600 dark:text-gray-300'}`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}