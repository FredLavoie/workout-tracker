from django.contrib.postgres.search import SearchVector, SearchQuery
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


class RecordSearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        query = self.request.GET.get('q', '')
        id = self.kwargs['author_id']

        object_list = Record.objects.annotate(
            search=SearchVector('type')+SearchVector('event')
        ).filter(
            search=SearchQuery(query)
        ).filter(
            author_id=id
        )

        return object_list


class EventRecordList(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        event = self.kwargs['event'].replace('-', ' ').title()
        records = Record.objects.filter(author_id=id, event=event)
        return records
