import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; 
import { Toaster } from 'react-hot-toast'; 

const vazir = Vazirmatn({ 
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazir",
});

export const metadata = {
  title: "سامانه مدیریت رویداد | ایوند پرو",
  description: "سامانه جامع ثبت نام و مدیریت رویدادها",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} font-sans bg-gray-50 text-gray-900`}>
        <Providers>
            <Toaster position="top-center" />
            {children}
        </Providers>
      </body>
    </html>
  );
}