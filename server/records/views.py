from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Record
from .permissions import IsAuthor
from .serializers import RecordSerializer

class RecordList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        records = Record.objects.filter(author_id=id)
        return records

class RecordDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        record = Record.objects.filter(author_id=id)
        return record
