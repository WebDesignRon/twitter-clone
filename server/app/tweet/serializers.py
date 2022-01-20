from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from users.models import User
from users.serializers import UserSerializer
from .models import Tweet, Like


class TweetSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    quoted_tweet_id = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    retweets = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_retweeted = serializers.SerializerMethodField()
    created_at_formated = serializers.SerializerMethodField()

    def create(self, validated_data):
        quoted_tweet_id = self.context.get("request").parser_context.get("kwargs").get("id")
        message = validated_data.get("message")
        if len(message) == 0 and quoted_tweet_id is None:
            raise serializers.ValidationError("tweet message is must")
        if len(message) == 0:
            message = None  # "tweet/<int:id>/retweets/with_comments"で .filter(message__isnull=False)する用
        return Tweet.objects.create(
            user=self.context.get("request").user,
            message=message,
            quoted_tweet_id=quoted_tweet_id,
        )

    def get_user(self, obj):
        return UserSerializer(User.objects.get(username=obj.user)).data

    def get_quoted_tweet_id(self, obj):
        return obj.quoted_tweet.id if obj.quoted_tweet else None

    def get_likes(self, obj):
        count = [0] * 5
        for like in obj.like.all():
            count[like.like_type - 1] += 1
        return count

    def get_retweets(self, obj):
        return Tweet.objects.filter(quoted_tweet=obj).count()

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
            return Tweet.objects.filter(user=request.user, quoted_tweet=obj).exists()
        return False

    def get_created_at_formated(self, obj):
        delta = timezone.now() - obj.created_at
        if delta.days == 0:
            return f"{int(delta / timedelta(hours=1))}時間"
        if timezone.now().year == obj.created_at.year:
            return obj.created_at.strftime("%m月%d日")
        return obj.created_at.strftime("%Y年%m月%d日")

    class Meta:
        model = Tweet
        fields = (
            "id",
            "user",
            "message",
            "quoted_tweet_id",
            "created_at",
            "created_at_formated",
            "likes",
            "retweets",
            "replies",
            "is_liked",
            "is_retweeted",
        )
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "created_at_formated",
            "quoted_tweet_id",
            "likes",
            "retweets",
            "replies",
            "is_liked",
            "is_retweeted",
        )


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("id", "user", "tweet", "like_type")
        read_only_fields = ("id", "user", "tweet")

    def create(self, user, tweet, validated_data):
        return Like.objects.create(user=user, tweet=tweet, **validated_data)
