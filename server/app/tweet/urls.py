from django.urls import path

from . import views


app_name = "tweet"
urlpatterns = [
    path("tweets", views.TweetListView.as_view(), name="tweet"),  # GET, POST
    path("tweets/<int:pk>", views.TweetDetailView.as_view(), name="tweet"),  # GET, DELETE
    path("tweets/<int:pk>/like", views.LikeView.as_view(), name="like"),  # POST
    path("tweets/<int:pk>/unlike", views.unlike_view, name="unlike"),  # DELETE
]
