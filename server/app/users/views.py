from rest_framework import generics

from .serializers import UserSerializer
from .models import User


class UserRegister(generics.CreateAPIView):
    model = User
    serializer_class = UserSerializer
