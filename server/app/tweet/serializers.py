from rest_framework import serializers

from .models import Tweet, QuoteTweet, Like


class TweetSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    retweets = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_retweeted = serializers.SerializerMethodField()

    def create(self, validated_data):
        return Tweet.objects.create(user=self.context["request"].user, **validated_data)

    def get_likes(self, obj):
        count = [0] * 5
        for like in obj.like.all():
            count[like.like_type - 1] += 1
        return count

    def get_retweets(self, obj):
        return obj.retweet.count() + QuoteTweet.objects.filter(quote_tweet=obj).count()

    def get_replies(self, obj):
        count = 0  # 返信の数を数える処理を書く
        return count

    def get_is_liked(self, obj):
        request = self.context["request"]
        if like := obj.like.filter(user=request.user):
            return like.first().like_type
        return 0

    def get_is_retweeted(self, obj):
        request = self.context["request"]
        if request.user.is_authenticated:
            return (
                request.user in obj.retweet.all()
                or QuoteTweet.objects.filter(quote_tweet=obj, user=request.user).exists()
            )
        return False

    class Meta:
        model = Tweet
        fields = ("id", "user", "message", "created_at", "likes", "retweets", "replies", "is_liked", "is_retweeted")
        read_only_fields = ("id", "user", "created_at", "likes", "retweets", "replies", "is_liked", "is_retweeted")


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("id", "user", "tweet", "like_type")
        read_only_fields = ("id", "user", "tweet")
    
    def create(self, user, tweet, validated_data):
        return Like.objects.create(user=user, tweet=tweet, **validated_data)
