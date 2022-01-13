from django.db.models import Exists, OuterRef, F
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from tweet.models import Tweet, Media, Like
from tweet.paginations import TweetPagination
from tweet.serializers import TweetSerializer
from .paginations import UserPagination
from .serializers import UserSerializer
from .models import Friends, User


class UserRegister(generics.CreateAPIView):
    model = User
    serializer_class = UserSerializer


class UserRetrieve(generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    model = User
    serializer_class = UserSerializer
    lookup_field = "username"
    queryset = User.objects.all()

    def destroy(self, request, *args, **kwargs):
        if self.get_object() != request.user:
            return Response({"detail": "You are not allowed to delete your account"}, status=status.HTTP_403_FORBIDDEN)
        super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def follow_view(request, *args, **kwargs):
    try:
        follower = User.objects.get(username=request.user.username)
        followee = User.objects.get(username=kwargs.get("username"), is_active=True)
    except User.DoesNotExist:
        return Response("Invalid username", status=status.HTTP_404_NOT_FOUND)

    Friends.objects.get_or_create(followee=followee, follower=follower)
    return Response({"followers_count": follower.followees.count()})


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def unfolow_view(request, *args, **kwargs):
    try:
        follower = User.objects.get(username=request.user.username)
        followee = User.objects.get(username=kwargs.get("username"))
        Friends.objects.filter(followee=followee, follower=follower).delete()
    except (User.DoesNotExist, Friends.DoesNotExist):
        return Response("Invalid username", status=status.HTTP_404_NOT_FOUND)

    return Response(status=status.HTTP_204_NO_CONTENT)


class UserMe(generics.UpdateAPIView, generics.RetrieveAPIView, generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    model = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer
    pagination_class = UserPagination
    queryset = User.objects.filter(is_staff=False, is_active=True)


class UserFollowersView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer
    pagination_class = UserPagination

    def get_queryset(self):
        return User.objects.get(username=self.kwargs.get("username")).followers.all()


class UserFollowingView(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer
    pagination_class = UserPagination

    def get_queryset(self):
        return User.objects.get(username=self.kwargs.get("username")).followees.all()


class UserTweetsView(generics.ListAPIView):
    model = Tweet
    serializer_class = TweetSerializer
    pagination_class = TweetPagination
    lookup_field = "username"

    def get_queryset(self):
        return Tweet.objects.filter(user__username=self.kwargs.get("username")).order_by("-created_at")


class UserLikesView(generics.ListAPIView):
    serializer_class = TweetSerializer
    pagination_class = TweetPagination

    def get_queryset(self):
        tweets = Tweet.objects.filter(
            Exists(Like.objects.filter(tweet=OuterRef("pk"), user__username=self.kwargs.get("username")))
        ).order_by(F("like__created_at").desc())
        # warning - this is a hack to get the likes in the correct order
        t = []
        for tweet in tweets:
            if tweet not in t:
                t.append(tweet)
        return t


class UserMediasView(generics.ListAPIView):
    serializer_class = TweetSerializer
    pagination_class = TweetPagination

    def get_queryset(self):
        return Tweet.objects.filter(
            Exists(Media.objects.filter(tweet=OuterRef("pk"))), user__username=self.kwargs.get("username")
        ).order_by(F("media__created_at").desc())
