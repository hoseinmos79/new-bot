from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'is_successful', 'created_at', 'ref_id')
    list_filter = ('is_successful', 'created_at')
    search_fields = ('user__username', 'authority', 'ref_id')