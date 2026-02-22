from django.db import models
import os


class SystemSetting(models.Model):
    # تنظیمات عمومی
    site_title = models.CharField(max_length=100, default="رویداد پرو", verbose_name="عنوان سایت")
    support_phones = models.TextField(default="021-00000000\n09120000000", verbose_name="تلفن‌های پشتیبانی")
    logo = models.ImageField(upload_to='site_logo/', null=True, blank=True, verbose_name="لوگو سایت")

    # فیلدهای صفحه تماس با ما
    contact_email = models.EmailField(blank=True, null=True, verbose_name="ایمیل ارتباطی")
    contact_address = models.TextField(blank=True, null=True, verbose_name="آدرس فیزیکی مجموعه")
    about_us = models.TextField(blank=True, null=True, verbose_name="متن درباره ما")

    # تنظیمات درگاه بانکی — فقط انتخاب درگاه فعال (کلیدها در .env هستند)
    GATEWAY_CHOICES = (
        ('zarinpal', 'زرین‌پال'),
        ('mellat', 'به‌پرداخت ملت'),
        ('saman', 'بانک سامان'),
    )
    active_gateway = models.CharField(
        max_length=20,
        choices=GATEWAY_CHOICES,
        default='zarinpal',
        verbose_name="درگاه فعال"
    )

    # تنظیمات پیامک — فقط انتخاب پنل فعال (کلیدها در .env هستند)
    SMS_CHOICES = (
        ('kavehnegar', 'کاوه نگار'),
        ('melipayamak', 'ملی پیامک'),
    )
    active_sms_panel = models.CharField(
        max_length=20,
        choices=SMS_CHOICES,
        default='kavehnegar',
        verbose_name="پنل پیامک فعال"
    )
    sms_sender_number = models.CharField(
        max_length=20,
        default="10002000",
        verbose_name="شماره خط فرستنده"
    )

    class Meta:
        verbose_name = "تنظیمات سیستم"
        verbose_name_plural = "تنظیمات سیستم"

    def __str__(self):
        return self.site_title

    def save(self, *args, **kwargs):
        # فقط یک رکورد مجاز است (Singleton)
        if not self.pk and SystemSetting.objects.exists():
            return
        return super().save(*args, **kwargs)

    # --- متدهای دسترسی به کلیدهای حساس از .env ---

    @property
    def zarinpal_merchant_id(self):
        return os.getenv('ZARINPAL_MERCHANT_ID', '')

    @property
    def mellat_terminal_id(self):
        return os.getenv('MELLAT_TERMINAL_ID', '')

    @property
    def mellat_username(self):
        return os.getenv('MELLAT_USERNAME', '')

    @property
    def mellat_password(self):
        return os.getenv('MELLAT_PASSWORD', '')

    @property
    def kavehnegar_api_key(self):
        return os.getenv('KAVEHNEGAR_API_KEY', '')

    @property
    def melipayamak_username(self):
        return os.getenv('MELIPAYAMAK_USERNAME', '')

    @property
    def melipayamak_password(self):
        return os.getenv('MELIPAYAMAK_PASSWORD', '')
