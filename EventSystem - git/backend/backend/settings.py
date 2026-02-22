from pathlib import Path
import os

# ساخت مسیرهای اصلی پروژه
BASE_DIR = Path(__file__).resolve().parent.parent

# کلید امنیتی (برای محیط توسعه)
SECRET_KEY = 'django-insecure-test-key-replace-me-in-production'

# حالت دیباگ (برای دیدن خطاها)
DEBUG = True

ALLOWED_HOSTS = []

# اپلیکیشن‌های نصب شده
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # پکیج‌های کمکی که نصب کردیم
    'rest_framework',
    'corsheaders',
    'core',
    'events',
    'payments',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # اضافه شده برای ارتباط با فرانت‌اند
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# --- تنظیمات دیتابیس (اتصال به داکر پستگرس) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'eventdb',
        'USER': 'eventuser',
        'PASSWORD': 'eventpass',
        'HOST': '127.0.0.1',
        'PORT': '54321', # همان پورتی که در داکر تنظیم کردیم
    }
}

# اعتبارسنجی رمز عبور
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# تنظیمات زبان و ساعت
LANGUAGE_CODE = 'fa-ir' # فارسی
TIME_ZONE = 'Asia/Tehran' # تهران
USE_I18N = True
USE_TZ = True

# --- تنظیمات فایل‌های استاتیک و مدیا ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# تنظیمات کلید اصلی پیش‌فرض
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# تنظیمات CORS (برای اینکه ریکت بتونه به جنگو وصل بشه)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]