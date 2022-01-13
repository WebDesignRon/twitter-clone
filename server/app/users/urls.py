from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views


app_name = "users"
urlpatterns = [
    path("register", views.UserRegister.as_view(), name="register"),  # POST
    path("token", TokenObtainPairView.as_view(), name="token"),  # POST
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),  # POST
    path("users", views.UserListView.as_view(), name="users"),  # GET, PATCH, DELETE
    path("users/me", views.UserMe.as_view(), name="me"),  # GET, PATCH, DELETE
    path("users/<str:username>", views.UserRetrieve.as_view(), name="user"),  # GET
    path("users/<str:username>/follow", views.follow_view, name="follow"),  # POST
    path("users/<str:username>/unfollow", views.unfolow_view, name="unfollow"),  # DELETE
    path("users/<str:username>/followers", views.UserFollowersView.as_view(), name="followers"),  # GET
    path("users/<str:username>/following", views.UserFollowingView.as_view(), name="following"),  # GET
    path("users/<str:username>/tweets", views.UserTweetsView.as_view(), name="tweets"),  # GET
    path("users/<str:username>/likes", views.UserLikesView.as_view(), name="likes"),  # GET
    path("users/<str:username>/medias", views.UserMediasView.as_view(), name="medias"),  # GET
]
