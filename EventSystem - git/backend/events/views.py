from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db.models import Sum, DecimalField
from django.db.models.functions import Coalesce
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Event, Lecturer, Ticket, Category
from .serializers import (
    EventSerializer, LecturerSerializer, TicketSerializer,
    CategorySerializer, UserListSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]


class MyTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(
            user=self.request.user, status='paid'
        ).order_by('-purchase_date')


class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserListSerializer

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        tickets = Ticket.objects.filter(
            user=user, status='paid'
        ).select_related('event')

        tickets_data = []
        total_spent = 0

        for ticket in tickets:
            price = ticket.event.price if (ticket.event and hasattr(ticket.event, 'price')) else 0
            total_spent += int(price)
            tickets_data.append({
                'id': ticket.id,
                'event_title': ticket.event.title if ticket.event else "رویداد حذف شده",
                'event_image': ticket.event.image.url if (ticket.event and ticket.event.image) else None,
                'purchase_date': ticket.purchase_date,
                'price': price,
                'location': ticket.event.location if ticket.event else "-",
                'is_checked_in': ticket.is_checked_in
            })

        user_data = UserListSerializer(user).data
        return Response({
            'user_info': user_data,
            'stats': {'total_tickets': tickets.count(), 'total_spent': total_spent},
            'tickets': tickets_data
        })


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'total_users': User.objects.count(),
            'total_events': Event.objects.count(),
            'total_tickets': Ticket.objects.filter(status='paid').count(),
            'total_revenue': Ticket.objects.filter(status='paid').aggregate(
                total=Coalesce(Sum('event__price'), 0, output_field=DecimalField())
            )['total'],
        })


class AdminEventTicketsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        tickets = Ticket.objects.filter(
            event=event, status='paid'
        ).select_related('user')

        result = [{
            'id': t.id,
            'ticket_code': t.ticket_code,
            'is_checked_in': t.is_checked_in,
            'purchase_date': t.purchase_date,
            'user_name': f"{t.user.first_name} {t.user.last_name}".strip() or t.user.username,
            'user_phone': t.user.username
        } for t in tickets]

        return Response({'event_title': event.title, 'tickets': result})


class AdminCheckInTicketView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        ticket_code = request.data.get('ticket_code')
        action = request.data.get('action', 'checkin')

        if not ticket_code:
            return Response(
                {'error': 'کد بلیط ارسال نشده است'},
                status=400
            )

        try:
            ticket = Ticket.objects.get(ticket_code=ticket_code)
            user_name = f"{ticket.user.first_name} {ticket.user.last_name}".strip() or ticket.user.username

            if action == 'undo':
                ticket.is_checked_in = False
                ticket.save()
                return Response({'message': 'حضور لغو شد', 'user_name': user_name})

            if ticket.is_checked_in:
                return Response(
                    {'error': 'این بلیط قبلاً استفاده شده است!', 'status': 'already_checked'},
                    status=400
                )

            ticket.is_checked_in = True
            ticket.save()
            return Response({
                'message': 'حضور با موفقیت ثبت شد',
                'user_name': user_name,
                'event_title': ticket.event.title
            })

        except Ticket.DoesNotExist:
            return Response(
                {'error': 'بلیط نامعتبر است (یافت نشد)'},
                status=404
            )
