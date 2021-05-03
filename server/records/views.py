# from django.contrib.auth.decorators import login_required
from rest_framework import generics
from .models import Record
from .serializers import RecordSerializer

class RecordList(generics.ListCreateAPIView):
    serializer_class = RecordSerializer

    # @login_required
    def get_queryset(self):
        id = self.kwargs['author_id']
        records = Record.objects.filter(author_id=id)
        return records

class RecordDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecordSerializer

    # @login_required
    def get_queryset(self):
        id = self.kwargs['author_id']
        record = Record.objects.filter(author_id=id)
        return record
