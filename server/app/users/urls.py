from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

app_name = "users"
urlpatterns = [
    path("register", views.UserRegister.as_view(), name="register"),
    path("token", TokenObtainPairView.as_view(), name="token"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
]
