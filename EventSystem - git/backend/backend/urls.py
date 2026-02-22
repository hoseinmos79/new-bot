from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.views import (
    EventViewSet,
    LecturerViewSet,
    CategoryViewSet,
    MyTicketsView,
    AdminStatsView,
    AdminUserViewSet,
    AdminEventTicketsView,
    AdminCheckInTicketView
)
from core.views import RegisterView, CustomTokenObtainPairView, SystemSettingView, UserProfileView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from payments.views import PurchaseTicketView, TransactionViewSet


router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'lecturers', LecturerViewSet, basename='lecturer')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
router.register(r'admin/transactions', TransactionViewSet, basename='admin-transaction')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/payments/', include('payments.urls')),

    # Auth
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='auth_register'),

    # Profile & Settings
    path('api/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/settings/', SystemSettingView.as_view(), name='system_settings'),

    # Tickets
    path('api/purchase/<int:event_id>/', PurchaseTicketView.as_view(), name='purchase_ticket'),
    path('api/my-tickets/', MyTicketsView.as_view(), name='my_tickets'),

    # Admin
    path('api/admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('api/admin/events/<int:event_id>/tickets/', AdminEventTicketsView.as_view(), name='admin_event_tickets'),
    path('api/admin/tickets/checkin/', AdminCheckInTicketView.as_view(), name='admin_ticket_checkin'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
