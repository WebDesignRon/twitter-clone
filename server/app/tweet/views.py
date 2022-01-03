from django.db.models import query
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Like, Tweet
from .serializers import TweetSerializer, LikeSerializer


class TweetListView(generics.ListAPIView, generics.CreateAPIView):
    model = Tweet
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer


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


class LikeView(generics.ListCreateAPIView):
    model = Like
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Like.objects.all() #ListAPI
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):
        tweet = Tweet.objects.filter(id=self.kwargs['pk']).first()
        delete_liked(request.user, tweet)
        data = {"user": request.user, "tweet": tweet, "like_type": request.data.get("like_type")}
        serializer = LikeSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            like = serializer.create(request.user, tweet, serializer.validated_data)
            return Response({"like_type": like.like_type}, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


def delete_liked(user, tweet):
    if (tweet.like.filter(user=user).count() > 0):
        tweet.like.filter(user=user).delete()


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def unlike_view(request, **kwargs):
    tweet = Tweet.objects.filter(id=kwargs['pk']).first()
    delete_liked(request.user, tweet)
    return Response({"LikeCount": tweet.like.count()})
