from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="کاربر")
    amount = models.PositiveIntegerField(verbose_name="مبلغ (تومان)")
    description = models.CharField(max_length=255, verbose_name="توضیحات تراکنش")
    
    # اطلاعات درگاه بانکی (زرین‌پال)
    authority = models.CharField(max_length=100, verbose_name="شناسه پرداخت (Authority)", blank=True, null=True)
    ref_id = models.CharField(max_length=100, verbose_name="کد پیگیری بانک (RefID)", blank=True, null=True)
    
    is_successful = models.BooleanField(default=False, verbose_name="موفق؟")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "تراکنش"
        verbose_name_plural = "تراکنش‌ها"

    def __str__(self):
        return f"{self.user.username} - {self.amount}"