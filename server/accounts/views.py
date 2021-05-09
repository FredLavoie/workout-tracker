from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import AccountSerializer

class AuthorDetail(generics.ListAPIView):
    serializer_class = AccountSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        username = self.kwargs['username']
        userInfo = CustomUser.objects.filter(username=username)
        return userInfo


