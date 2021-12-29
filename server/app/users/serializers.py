from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    follows = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def get_follows(self, obj):
        return obj.followee.count()

    def get_followers(self, obj):
        return obj.follower.count()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
            "display_name",
            "bio",
            "location",
            "website",
            "birth_date",
            "icon",
            "header",
            "follows",
            "followers",
        )
