from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

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
