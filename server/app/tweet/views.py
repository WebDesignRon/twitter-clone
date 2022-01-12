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

if endpoint_url := settings.AWS_S3_ENDPOINT_URL:
    s3 = boto3.client("s3", endpoint_url=endpoint_url, config=Config(signature_version="s3v4"))
else:
    s3 = boto3.client("s3", config=Config(signature_version="s3v4", region_name=settings.AWS_S3_REGION_NAME))


class TweetListView(generics.ListAPIView, generics.CreateAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = TweetPagination
    serializer_class = TweetSerializer

    def get_queryset(self):
        followers = self.request.user.followees.all()
        request_user = self.request.user
        return (
            Tweet.objects.filter(user__in=followers)
            .union(Tweet.objects.filter(user=request_user))
            .order_by("-created_at")
        )


class TweetDetailView(generics.RetrieveDestroyAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer
    queryset = Tweet.objects.all()
    lookup_field = "pk"

    def delete(self, request, *args, **kwargs):
        tweet = self.get_object()
        if tweet.user == request.user:
            return super().delete(request, *args, **kwargs)
        else:
            return Response({"detail": "You are not allowed to delete this tweet"}, status=status.HTTP_403_FORBIDDEN)


class LikeView(generics.CreateAPIView):
    model = Like
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):
        tweet = generics.get_object_or_404(Tweet, pk=request.data.get("id"))
        try:
            delete_liked(request.user, tweet)
        except AttributeError:
            return Response({"Invalid tweet"}, status=status.HTTP_400_BAD_REQUEST)

        data = {"user": request.user, "tweet": tweet, "like_type": request.data.get("like_type")}
        serializer = LikeSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            like = serializer.create(request.user, tweet, serializer.validated_data)
            return Response({"like_type": like.like_type}, status=status.HTTP_201_CREATED)
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
    tweet = generics.get_object_or_404(Tweet, pk=request.data.get("id"))
    try:
        delete_liked(request.user, tweet)
    except AttributeError:
        return Response({"Invalid tweet"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def retweet_view(request, **kwargs):
    tweet = generics.get_object_or_404(Tweet, pk=request.data.get("id"))
    serializer = TweetSerializer(data={"user": request.user, "quoted_tweet": tweet})
    if not serializer.is_valid():
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def un_retweet_view(request, **kwargs):
    tweet = generics.get_object_or_404(Tweet, pk=request.data.get("id"))
    if tweet.retweet.filter(user=request.user).count() <= 0:
        return Response({"error": "リツイートが存在しないです"}, status=status.HTTP_400_BAD_REQUEST)
    tweet.filter(user=request.user, quoted_tweet=tweet.id).delete()


class QuoteTweetView(generics.CreateAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TweetSerializer

    def create(self, request, *args, **kwargs):
        tweet = generics.get_object_or_404(Tweet, pk=request.data.get("id"))
        data = {"user": request.user, "message": request.data.get("message"), "quoted_tweet": tweet}
        serializer = TweetSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            quoteTweet = serializer.create(request.user, tweet, serializer.validated_data)
            return Response({"quote-tweet": str(quoteTweet)}, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


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
