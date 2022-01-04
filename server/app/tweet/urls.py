from django.urls import path

from . import views


app_name = "tweet"
urlpatterns = [
    path("tweets", views.TweetListView.as_view(), name="tweet"),  # GET, POST
    path("tweets/<int:pk>", views.TweetDetailView.as_view(), name="tweet"),  # GET, DELETE
    path("tweets/<int:pk>/like", views.LikeView.as_view(), name="like"),  # POST
    path("tweets/<int:pk>/unlike", views.unlike_view, name="unlike"),  # DELETE
    path("tweets/<int:pk>/retweet", views.retweet_view, name="retweet"),  # POST
    path("tweets/<int:pk>/un-retweet", views.un_retweet_view, name="un-retweet"),  # DELETE
    path("tweets/<int:pk>/quote-tweet", views.QuoteTweetView.as_view(), name="quotetweet"),  # POST
]
