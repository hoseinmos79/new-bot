from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from events.models import Event, Category, Lecturer


class PurchaseTicketTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='buyer',
            password='buyerpass123'
        )
        self.category = Category.objects.create(title='دسته تست')
        self.lecturer = Lecturer.objects.create(
            name='مدرس',
            specialty='تخصص',
            bio='بیو'
        )
        self.event = Event.objects.create(
            title='رویداد خرید تست',
            description='توضیحات',
            category=self.category,
            lecturer=self.lecturer,
            start_time=timezone.now(),
            location='تهران',
            price=200000,
            capacity=2,
            is_active=True
        )
        self.client = APIClient()

    def test_purchase_requires_login(self):
        """خرید بدون لاگین نباید ممکن باشد"""
        response = self.client.post(f'/api/purchase/{self.event.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_purchase_success(self):
        """خرید موفق باید بلیط صادر کند و ظرفیت را کم کند"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/purchase/{self.event.id}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('ticket_code', response.data)

        # ظرفیت باید یکی کم شده باشد
        self.event.refresh_from_db()
        self.assertEqual(self.event.capacity, 1)

    def test_purchase_duplicate_ticket(self):
        """خرید تکراری برای یک رویداد نباید ممکن باشد"""
        self.client.force_authenticate(user=self.user)
        self.client.post(f'/api/purchase/{self.event.id}/')
        response = self.client.post(f'/api/purchase/{self.event.id}/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_purchase_full_capacity(self):
        """خرید وقتی ظرفیت صفر است نباید ممکن باشد"""
        self.event.capacity = 0
        self.event.save()
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/purchase/{self.event.id}/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
