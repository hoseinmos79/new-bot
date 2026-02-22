from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()
    date_jalali = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        # مطمئن شوید که فیلدهای زیر در مدل Transaction شما وجود دارند
        # اگر نام فیلد تاریخ شما created_at نیست (مثلا date است)، آن را اصلاح کنید
        fields = ['id', 'user', 'user_full_name', 'amount', 'description', 'ref_id', 'authority', 'is_successful', 'created_at', 'date_jalali']

    def get_user_full_name(self, obj):
        if obj.user:
            name = f"{obj.user.first_name} {obj.user.last_name}"
            return name if name.strip() else obj.user.username
        return "ناشناس"
        
    def get_date_jalali(self, obj):
        # تبدیل تاریخ میلادی به شمسی (اختیاری - برای نمایش بهتر)
        # فعلا فرمت ساده برمی‌گردانیم، می‌توانید از jdatetime استفاده کنید
        if hasattr(obj, 'created_at') and obj.created_at:
             return obj.created_at.strftime("%Y/%m/%d %H:%M")
        return "-"