from django.contrib import admin
from .models import SystemSetting

@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ('site_title', 'support_phones')
    
    # این متد باعث می‌شود دکمه "افزودن" وقتی یک ردیف وجود دارد، مخفی شود
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)