from rest_framework import serializers

from .models import Tweet, QuoteTweet


class TweetSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    retweets = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    def create(self, validated_data):
        return Tweet.objects.create(user=self.context["request"].user, **validated_data)

    def get_likes(self, obj):
        count = {"HOSHI1": 0, "HOSHI2": 0, "HOSHI3": 0, "HOSHI4": 0, "HOSHI5": 0}
        for like in obj.like.all():
            count[like.like_type] += 1

    def get_retweets(self, obj):
        return obj.retweet.count() + QuoteTweet.objects.filter(quote_tweet=obj).count()

    def get_replies(self, obj):
        count = 0  # 返信の数を数える処理を書く
        return count

    class Meta:
        model = Tweet
        fields = ("id", "user", "message", "created_at", "likes", "retweets", "replies")
        read_only_fields = ("id", "user", "created_at", "likes", "retweets", "replies")
