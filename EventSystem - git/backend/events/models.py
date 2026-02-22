from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

# --- 1. مدل دسته‌بندی ---
class Category(models.Model):
    title = models.CharField(max_length=100, verbose_name="عنوان دسته‌بندی")
    slug = models.SlugField(unique=True, blank=True, null=True, allow_unicode=True, verbose_name="شناسه یکتا")

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"

    def save(self, *args, **kwargs):
        # اگر اسلاگ خالی بود، از روی تایتل بساز
        if not self.slug:
            # allow_unicode=True برای پشتیبانی از فارسی حیاتی است
            self.slug = slugify(self.title, allow_unicode=True)
            
            # اگر اسلاگ خالی شد (مثلاً کاراکتر غیرمجاز بود)، یک اسلاگ تصادفی بساز
            if not self.slug:
                import uuid
                self.slug = str(uuid.uuid4())[:8]
                
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

# --- 2. مدل مدرس ---
class Lecturer(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام و نام خانوادگی")
    specialty = models.CharField(max_length=100, verbose_name="تخصص")
    bio = models.TextField(verbose_name="بیوگرافی")
    image = models.ImageField(upload_to='lecturers/', verbose_name="تصویر مدرس", null=True, blank=True)

    class Meta:
        verbose_name = "مدرس"
        verbose_name_plural = "مدرسین"

    def __str__(self):
        return self.name

# --- 3. مدل رویداد ---
class Event(models.Model):
    MODE_CHOICES = [
        ('in_person', 'حضوری'),
        ('virtual', 'مجازی'),
    ]

    title = models.CharField(max_length=200, verbose_name="عنوان رویداد")
    description = models.TextField(verbose_name="توضیحات")
    
    # فیلدهای داینامیک
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='events', verbose_name="دسته‌بندی")
    lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, related_name='events', verbose_name="مدرس")
    
    start_time = models.DateTimeField(verbose_name="زمان شروع")
    location = models.CharField(max_length=200, verbose_name="مکان برگزاری")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="قیمت")
    capacity = models.PositiveIntegerField(verbose_name="ظرفیت")
    image = models.ImageField(upload_to='events/', verbose_name="تصویر رویداد", null=True, blank=True)
    
    # فیلد بازگشته: نوع برگزاری
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='in_person', verbose_name="نوع برگزاری")
    
    is_active = models.BooleanField(default=True, verbose_name="فعال/غیرفعال")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "رویداد"
        verbose_name_plural = "رویدادها"

    def __str__(self):
        return self.title

# --- 4. مدل بلیط ---
class Ticket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده'),
        ('cancelled', 'لغو شده'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets', verbose_name="رویداد")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets', verbose_name="کاربر")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="وضعیت")
    ticket_code = models.CharField(max_length=50, unique=True, blank=True, verbose_name="کد بلیط")
    purchase_date = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ خرید")
    
    # فیلد بازگشته: وضعیت ورود
    is_checked_in = models.BooleanField(default=False, verbose_name="وارد سالن شده")

    def save(self, *args, **kwargs):
        if not self.ticket_code:
            import uuid
            self.ticket_code = str(uuid.uuid4()).split('-')[0].upper()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "بلیط"
        verbose_name_plural = "بلیط‌ها"

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"