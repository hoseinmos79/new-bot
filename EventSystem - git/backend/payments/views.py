from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import F
from .models import Transaction
from events.models import Event, Ticket
from .serializers import TransactionSerializer


class PurchaseTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = request.user

        with transaction.atomic():
            # قفل کردن رکورد رویداد برای جلوگیری از Race Condition
            event = Event.objects.select_for_update().filter(
                id=event_id, is_active=True
            ).first()

            if not event:
                return Response(
                    {'error': 'رویداد یافت نشد یا غیرفعال است'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # بررسی خرید تکراری
            already_bought = Ticket.objects.filter(
                event=event, user=user, status='paid'
            ).exists()
            if already_bought:
                return Response(
                    {'error': 'شما قبلاً برای این رویداد بلیط خریداری کرده‌اید'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # بررسی ظرفیت
            if event.capacity <= 0:
                return Response(
                    {'error': 'ظرفیت رویداد تکمیل است'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # کاهش ظرفیت با F() expression (ایمن در برابر race condition)
            Event.objects.filter(id=event_id).update(capacity=F('capacity') - 1)

            # ایجاد تراکنش
            txn = Transaction.objects.create(
                user=user,
                amount=event.price,
                description=f"خرید بلیط رویداد {event.title}",
                is_successful=True  # TODO: در مرحله بعد به درگاه واقعی وصل می‌شود
            )

            # صدور بلیط
            ticket = Ticket.objects.create(
                event=event,
                user=user,
                status='paid'
            )

        return Response(
            {
                'message': 'خرید با موفقیت انجام شد',
                'transaction_id': txn.id,
                'ticket_code': ticket.ticket_code
            },
            status=status.HTTP_201_CREATED
        )


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'ref_id', 'authority', 'description']
    ordering_fields = ['amount', 'created_at', 'is_successful']
