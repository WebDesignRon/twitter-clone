from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

app_name = "users"
urlpatterns = [
    path("register", views.UserRegister.as_view(), name="register"),
    path("token", TokenObtainPairView.as_view(), name="token"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("me", views.UserMe.as_view(), name="me"),
    path("<str:username>", views.UserRetrieve.as_view(), name="user"),
    path("<str:username>/follow", views.follow_view, name="follow"),
    path("<str:username>/unfollow", views.unfolow_view, name="unfollow"),
]
