from rest_framework import viewsets, generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from .models import Transaction
from events.models import Event, Ticket
from .serializers import TransactionSerializer

# --- ویوی خرید بلیط (که قبلاً داشتید) ---
class PurchaseTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        user = request.user

        # بررسی ظرفیت
        if event.capacity <= 0:
            return Response({'error': 'ظرفیت تکمیل است'}, status=status.HTTP_400_BAD_REQUEST)

        # ایجاد تراکنش (فعلاً موفق فرض می‌کنیم)
        transaction = Transaction.objects.create(
            user=user,
            amount=event.price,
            description=f"خرید بلیط رویداد {event.title}",
            is_successful=True
        )

        # صدور بلیط
        Ticket.objects.create(
            event=event,
            user=user,
            status='paid'
        )

        # کاهش ظرفیت
        event.capacity -= 1
        event.save()

        return Response({'message': 'خرید با موفقیت انجام شد', 'transaction_id': transaction.id}, status=status.HTTP_201_CREATED)

# --- ویوی جدید مدیریت تراکنش‌ها ---
class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    # لیست تراکنش‌ها - مرتب‌سازی پیش‌فرض بر اساس جدیدترین
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]
    
    # فعال‌سازی جستجو و فیلتر
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    # فیلدهایی که کاربر می‌تواند جستجو کند
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'ref_id', 'authority', 'description']
    
    # فیلدهایی که کاربر می‌تواند سورت کند
    ordering_fields = ['amount', 'created_at', 'is_successful']