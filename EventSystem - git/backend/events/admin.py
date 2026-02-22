from django.contrib import admin
from .models import Event, Ticket, Category, Lecturer

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)} # ساخت خودکار اسلاگ از عنوان

@admin.register(Lecturer)
class LecturerAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty']
    search_fields = ['name']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    # فیلدهای جدید را اینجا اضافه کردیم
    list_display = ['title', 'category', 'lecturer', 'price', 'start_time', 'mode', 'is_active']
    list_filter = ['is_active', 'mode', 'category']
    search_fields = ['title', 'description']
    date_hierarchy = 'start_time'

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'status', 'ticket_code', 'is_checked_in', 'purchase_date']
    list_filter = ['status', 'is_checked_in', 'event']
    search_fields = ['user__username', 'ticket_code', 'event__title']
    list_editable = ['is_checked_in'] # امکان تیک زدن ورود در لیست