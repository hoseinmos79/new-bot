from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from .models import Event, Category, Lecturer, Ticket


class EventAPITestCase(TestCase):

    def setUp(self):
        # ساخت کاربر معمولی
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        # ساخت ادمین
        self.admin = User.objects.create_superuser(
            username='admin',
            password='adminpass123'
        )
        # ساخت دسته‌بندی و مدرس
        self.category = Category.objects.create(title='تست')
        self.lecturer = Lecturer.objects.create(
            name='مدرس تست',
            specialty='تست',
            bio='بیوگرافی تست'
        )
        # ساخت رویداد
        self.event = Event.objects.create(
            title='رویداد تست',
            description='توضیحات تست',
            category=self.category,
            lecturer=self.lecturer,
            start_time=timezone.now(),
            location='تهران',
            price=100000,
            capacity=10,
            is_active=True
        )
        self.client = APIClient()

    def test_list_events_public(self):
        """کاربر لاگین‌نشده باید بتواند لیست رویدادها را ببیند"""
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_event_as_admin(self):
        """فقط ادمین باید بتواند رویداد بسازد"""
        self.client.force_authenticate(user=self.admin)
        data = {
            'title': 'رویداد جدید',
            'description': 'توضیح',
            'category': self.category.id,
            'lecturer': self.lecturer.id,
            'start_time': timezone.now(),
            'location': 'اصفهان',
            'price': 50000,
            'capacity': 20,
        }
        response = self.client.post('/api/events/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_event_as_regular_user_forbidden(self):
        """کاربر معمولی نباید بتواند رویداد بسازد"""
        self.client.force_authenticate(user=self.user)
        data = {'title': 'هک', 'description': 'x', 'price': 0, 'capacity': 1}
        response = self.client.post('/api/events/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_my_tickets_requires_login(self):
        """بدون لاگین نباید بتوان بلیط‌ها را دید"""
        response = self.client.get('/api/my-tickets/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_ticket_code_auto_generated(self):
        """کد بلیط باید به صورت خودکار تولید شود"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        self.assertIsNotNone(ticket.ticket_code)
        self.assertTrue(len(ticket.ticket_code) > 0)
