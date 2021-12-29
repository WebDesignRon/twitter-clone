from django.db import models

from users.models import User


class Tweet(models.Model):
    user = models.ForeignKey(User, related_name="tweet", on_delete=models.CASCADE)
    message = models.CharField(max_length=140)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text


class Like(models.Model):
    class LikeType(models.IntegerChoices):
        HOSHI1 = 1, "星1"
        HOSHI2 = 2, "星2"
        HOSHI3 = 3, "星3"
        HOSHI4 = 4, "星4"
        HOSHI5 = 5, "星5"

    user = models.ForeignKey(User, related_name="like", on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, related_name="like", on_delete=models.CASCADE)
    like_type = models.IntegerField(LikeType.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text


class Media(models.Model):
    tweet = models.ForeignKey(Tweet, related_name="media", on_delete=models.CASCADE)
    media_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text


class Retweet(models.Model):
    tweet = models.ForeignKey(Tweet, related_name="retweet", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text


class QuoteTweet(Tweet):
    quoted_tweet = models.ForeignKey("self", related_name="quote_tweet", on_delete=models.CASCADE)
    quote_message = models.CharField(max_length=140)

    def __str__(self):
        return self.text
