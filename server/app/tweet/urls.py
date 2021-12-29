from django.urls import path

from . import views


app_name = "tweet"
urlpatterns = [
    path("tweets", views.TweetListView.as_view(), name="tweet"),  # GET, POST
    path("tweets/<int:pk>", views.TweetDetailView.as_view(), name="tweet"),  # GET, DELETE
]
