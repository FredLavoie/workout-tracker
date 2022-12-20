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
        id = self.kwargs["author_id"]
        queryset = Record.objects.filter(author_id=id)
        return queryset


class RecordDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        queryset = Record.objects.filter(author_id=id)
        return queryset


class RecordSearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        id = self.kwargs["author_id"]

        queryset = Record.objects.annotate(
            search=SearchVector("type")+SearchVector("event")
        ).filter(
            search=SearchQuery(query)
        ).filter(
            author_id=id
        )

        return queryset


class EventRecordList(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        event = self.kwargs["event"].replace("-", " ").title()
        eventFixedKm = event.replace("Km", "km")
        eventFixedM = eventFixedKm.replace("0M", "0m")
        eventFixedMin = eventFixedM.replace(" Min", " min")
        queryset = Record.objects.filter(author_id=id, event=eventFixedMin)
        return queryset
