from django.urls import path

from . import views


app_name = "tweet"
urlpatterns = [
    path("tweets", views.TweetListView.as_view(), name="tweet"),  # GET, POST
    path("tweets/<int:id>", views.TweetDetailView.as_view(), name="tweet"),  # GET, DELETE
    path("tweets/<int:id>/like", views.LikeView.as_view(), name="like"),  # POST
    path("tweets/<int:id>/unlike", views.unlike_view, name="unlike"),  # DELETE
    path("tweets/<int:id>/retweet", views.retweet_view, name="retweet"),  # POST
    path("tweets/<int:id>/unretweet", views.un_retweet_view, name="un-retweet"),  # DELETE
    path("tweets/<int:id>/quote", views.QuoteTweetView.as_view(), name="quotetweet"),  # POST
    path("tweet/<int:id>/retweets", views.RetweetUsersView.as_view(), name="retweet-users"),  # GET
    path("tweet/<int:id>/retweets/with_comments", views.QuoteTweetsView.as_view(), name="quote-tweets"),  # GET
    path("tweet/<int:id>/likes", views.LikeUsersView.as_view(), name="like-users"),  # GET
    path("users/<str:username>/home-timeline", views.HomeTimelineView.as_view(), name="home_timeline"),  # POST
    path("presigned-url", views.get_presigned_url, name="presigned-url"),  # GET
]
