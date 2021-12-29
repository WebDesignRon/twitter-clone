from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Tweet
from .serializers import TweetSerializer


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
