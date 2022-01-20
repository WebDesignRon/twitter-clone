from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Friends

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    follows = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(read_only=True, format="%Y年%m月")

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def get_follows(self, obj):
        return obj.followee.count()

    def get_followers(self, obj):
        return obj.follower.count()

    def get_is_following(self, obj):
        request = self.context.get("request")
        if request:
            user = request.user
            if user.is_authenticated:
                return Friends.objects.filter(follower=user, followee=obj).exists()
        return False

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "display_name",
            "password",
            "bio",
            "location",
            "website",
            "birth_date",
            "date_joined",
            "icon",
            "header",
            "follows",
            "followers",
            "is_following",
        )
        read_only_fields = ("id", "date_joined", "follows", "followers", "is_following")
