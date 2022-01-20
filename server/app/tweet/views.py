import uuid
import boto3
from django.conf import settings
from botocore.config import Config
from botocore.exceptions import ClientError
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Like, Tweet
from .paginations import TweetPagination
from .serializers import TweetSerializer, LikeSerializer
from users.models import User

if endpoint_url := settings.AWS_S3_ENDPOINT_URL:
    s3 = boto3.client("s3", endpoint_url=endpoint_url, config=Config(signature_version="s3v4"))
else:
    s3 = boto3.client("s3", config=Config(signature_version="s3v4", region_name=settings.AWS_S3_REGION_NAME))


class HomeTimelineView(generics.ListAPIView):
    serializer_class = TweetSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = TweetPagination

    def get_queryset(self):
        followers = self.request.user.followees.all()
        request_user = self.request.user
        return (
            Tweet.objects.filter(user__in=followers)
            .union(Tweet.objects.filter(user=request_user))
            .order_by("-created_at")
        )


class TweetListView(generics.ListAPIView, generics.CreateAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = TweetPagination
    serializer_class = TweetSerializer

    def get_queryset(self):
        if q := self.request.GET.get("q"):
            return Tweet.objects.filter(message__icontains=q).order_by("-created_at")
        return Tweet.objects.order_by("-created_at")


class TweetDetailView(generics.RetrieveDestroyAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    lookup_field = "id"

    def delete(self, request, *args, **kwargs):
        tweet = self.get_object()
        if tweet.user == request.user:
            return super().delete(request, *args, **kwargs)
        else:
            return Response({"detail": "You are not allowed to delete this tweet"}, status=status.HTTP_403_FORBIDDEN)


class RetweetUsersView(generics.RetrieveAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    lookup_field = "id"

    def get(self, request, *args, **kwargs):
        serializer = self.retrieve(request)
        if serializer.data["is_retweeted"] > 0:
            retweets = Tweet.objects.filter(quoted_tweet=self.get_object())
            return Response(User.objects.filter(tweet__in=retweets).values(), status=status.HTTP_200_OK)
        return Response({"detail": "This tweet is not retweeted"}, status=status.HTTP_404_NOT_FOUND)


class LikeUsersView(generics.RetrieveAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    lookup_field = "id"

    def get(self, request, *args, **kwargs):
        serializer = self.retrieve(request)
        if serializer.data["is_liked"] > 0:
            likes = Like.objects.filter(tweet=self.get_object())
            return Response(User.objects.filter(like__in=likes).values(), status=status.HTTP_200_OK)
        return Response({"detail": "This tweet is not liked"}, status=status.HTTP_404_NOT_FOUND)


class LikeView(generics.CreateAPIView):
    model = Like
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):
        tweet = generics.get_object_or_404(Tweet, pk=self.kwargs.get("id"))
        if not tweet.message and tweet.quoted_tweet:
            tweet = generics.get_object_or_404(Tweet, pk=tweet.quoted_tweet.pk)
        try:
            delete_liked(request.user, tweet)
        except AttributeError:
            return Response({"Invalid tweet"}, status=status.HTTP_400_BAD_REQUEST)

        data = {"user": request.user, "tweet": tweet, "like_type": request.data.get("like_type")}
        serializer = LikeSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            like = serializer.create(request.user, tweet, serializer.validated_data)
            return Response(
                {"id": tweet.id, "like_type": like.like_type, "created_at": like.created_at},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


def delete_liked(user, tweet):
    try:
        if tweet.like.filter(user=user).count() > 0:
            tweet.like.filter(user=user).delete()
    except AttributeError:
        raise AttributeError


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def unlike_view(request, **kwargs):
    tweet = generics.get_object_or_404(Tweet, pk=kwargs.get("id"))
    try:
        delete_liked(request.user, tweet)
    except AttributeError:
        return Response({"Invalid tweet"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def retweet_view(request, **kwargs):
    tweet = generics.get_object_or_404(Tweet, pk=kwargs.get("id"))
    if not tweet.message and tweet.quoted_tweet:
        tweet = generics.get_object_or_404(Tweet, pk=tweet.quoted_tweet.pk)
    if Tweet.objects.filter(user=request.user, quoted_tweet=tweet).exists():
        return Response({"detail": "You have already retweeted this tweet"}, status=status.HTTP_400_BAD_REQUEST)
    rt = Tweet.objects.create(user=request.user, quoted_tweet=tweet)
    return Response(
        {"id": rt.id, "quoted_tweet_id": tweet.id, "created_at": rt.created_at}, status=status.HTTP_201_CREATED
    )


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def un_retweet_view(request, **kwargs):
    tweet = generics.get_object_or_404(Tweet, pk=kwargs.get("id"))
    if tweet.quoted_tweet:
        tweet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    generics.get_object_or_404(Tweet, quoted_tweet=kwargs.get("id"), user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class QuoteTweetView(generics.CreateAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer

    def create(self, request, *args, **kwargs):
        tweet = generics.get_object_or_404(Tweet, pk=kwargs.get("id"))
        message = request.data.get("message")
        # messageがないとretweetとして処理
        if len(message) == 0 and Tweet.objects.filter(user=request.user, quoted_tweet=tweet).exists():
            return Response({"detail": "You have already retweeted this tweet"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={"message": message, "quoted_tweet": tweet.id})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class QuoteTweetsView(generics.RetrieveAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    lookup_field = "id"

    def get(self, request, *args, **kwargs):
        serializer = self.retrieve(request)
        if serializer.data["is_retweeted"] == 0:
            return Response({"detail": "This tweet is not retweeted"}, status=status.HTTP_404_NOT_FOUND)
        quote_retweets = Tweet.objects.filter(quoted_tweet=self.get_object(), message__isnull=False)
        if quote_retweets.count() == 0:
            return Response({"detail": "This tweet is not quote retweeted"}, status=status.HTTP_404_NOT_FOUND)
        return Response(quote_retweets.values(), status=status.HTTP_200_OK)


@api_view(["GET"])
def get_presigned_url(request):
    key_uuid = uuid.uuid4().hex
    key = f"user_photos/{key_uuid}.jpg"

    try:
        presigned_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": key},
            ExpiresIn=3600,
            HttpMethod="PUT",
        )
    except ClientError as exc:
        return Response({"detail": exc.args[0]}, status.HTTP_400_BAD_REQUEST)
    return Response({"url": presigned_url, "key": key})
