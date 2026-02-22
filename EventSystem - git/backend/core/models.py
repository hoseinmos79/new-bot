from django.db import models

class SystemSetting(models.Model):
    # تنظیمات عمومی
    site_title = models.CharField(max_length=100, default="رویداد پرو", verbose_name="عنوان سایت")
    support_phones = models.TextField(default="021-00000000\n09120000000", verbose_name="تلفن‌های پشتیبانی")
    logo = models.ImageField(upload_to='site_logo/', null=True, blank=True, verbose_name="لوگو سایت")
    
    # --- فیلدهای جدید برای صفحه تماس با ما ---
    contact_email = models.EmailField(blank=True, null=True, verbose_name="ایمیل ارتباطی")
    contact_address = models.TextField(blank=True, null=True, verbose_name="آدرس فیزیکی مجموعه")
    about_us = models.TextField(blank=True, null=True, verbose_name="متن درباره ما")
    
    # --- تنظیمات درگاه بانکی ---
    GATEWAY_CHOICES = (
        ('zarinpal', 'زرین‌پال'),
        ('mellat', 'به‌پرداخت ملت'),
        ('saman', 'بانک سامان'),
    )
    active_gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES, default='zarinpal', verbose_name="درگاه فعال")
    zarinpal_merchant_id = models.CharField(max_length=100, blank=True, verbose_name="مرچنت کد زرین‌پال")
    mellat_terminal_id = models.CharField(max_length=100, blank=True, verbose_name="ترمینال آیدی ملت")
    mellat_username = models.CharField(max_length=100, blank=True, verbose_name="نام کاربری ملت")
    mellat_password = models.CharField(max_length=100, blank=True, verbose_name="رمز عبور ملت")
    
    # --- تنظیمات پیامک ---
    SMS_CHOICES = (
        ('kavehnegar', 'کاوه نگار'),
        ('melipayamak', 'ملی پیامک'),
    )
    active_sms_panel = models.CharField(max_length=20, choices=SMS_CHOICES, default='kavehnegar', verbose_name="پنل پیامک فعال")
    sms_sender_number = models.CharField(max_length=20, default="10002000", verbose_name="شماره خط فرستنده مشترک")
    kavehnegar_api_key = models.CharField(max_length=200, blank=True, verbose_name="کلید API کاوه نگار")
    melipayamak_username = models.CharField(max_length=100, blank=True, verbose_name="نام کاربری ملی پیامک")
    melipayamak_password = models.CharField(max_length=100, blank=True, verbose_name="رمز عبور ملی پیامک")

    class Meta:
        verbose_name = "تنظیمات سیستم"
        verbose_name_plural = "تنظیمات سیستم"

    def __str__(self):
        return self.site_title

    def save(self, *args, **kwargs):
        if not self.pk and SystemSetting.objects.exists():
            return
        return super(SystemSetting, self).save(*args, **kwargs)