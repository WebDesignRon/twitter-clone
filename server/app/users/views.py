from django.db.models import Exists, OuterRef, F
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from tweet.models import Tweet, Media, Like
from tweet.serializers import TweetSerializer
from .serializers import UserSerializer
from .models import Friends, User


class UserRegister(generics.CreateAPIView):
    model = User
    serializer_class = UserSerializer


class UserRetrieve(generics.RetrieveAPIView):
    model = User
    serializer_class = UserSerializer
    lookup_field = "username"


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def follow_view(request, *args, **kwargs):
    try:
        follower = User.objects.get(username=request.user.username)
        followee = User.objects.get(username=kwargs.get("username"), is_active=True)
    except User.DoesNotExist:
        return Response("Invalid username", status=status.HTTP_404_NOT_FOUND)

    Friends.objects.get_or_create(followee=followee, follower=follower)
    return Response({"followersCount": follower.followees.count()})


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def unfolow_view(request, *args, **kwargs):
    try:
        follower = User.objects.get(username=request.user.username)
        followee = User.objects.get(username=kwargs.get("username"))
        Friends.objects.filter(followee=followee, follower=follower).delete()
    except (User.DoesNotExist, Friends.DoesNotExist):
        return Response("Invalid username", status=status.HTTP_404_NOT_FOUND)

    return Response({"followersCount": follower.followees.count()})


class UserMe(generics.UpdateAPIView, generics.RetrieveAPIView, generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    model = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer
    queryset = User.objects.all()


class UserFollowersView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.request.user.followers.all()


class UserFollowingView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.request.user.followees.all()


class UserTweetsView(generics.ListAPIView):
    model = Tweet
    serializer_class = TweetSerializer
    lookup_field = "username"

    def get_queryset(self):
        return Tweet.objects.filter(user__username=self.kwargs.get("username")).order_by("-created_at")


class UserLikesView(generics.ListAPIView):
    model = Tweet
    serializer_class = TweetSerializer
    lookup_field = "username"

    def get_queryset(self):
        return Tweet.objects.filter(
            Exists(Like.objects.filter(tweet=OuterRef("pk"), user__username=self.kwargs.get("username")))
        ).order_by(F("like__created_at").desc())


class UserMediasView(generics.ListAPIView):
    model = Tweet
    serializer_class = TweetSerializer
    lookup_field = "username"

    def get_queryset(self):
        return Tweet.objects.filter(
            Exists(Media.objects.filter(tweet=OuterRef("pk"))), user__username=self.kwargs.get("username")
        )
