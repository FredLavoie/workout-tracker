from django.contrib.postgres.search import SearchVector, SearchQuery
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Record
from .permissions import IsAuthor
from .serializers import RecordSerializer
from .utils import latest_record_for_event


class RecordList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        """
        Get latest record for each event type

        Example: if there are 3 records for "Back Squat", the
        get_queryset function will return only the latest one
        based on the record date.
        """
        id = self.kwargs["author_id"]
        queryset = Record.objects.filter(author_id=id).order_by("event")
        queryset = latest_record_for_event(queryset)
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
        """
        Get the list of records for a specific event

        Return results sorted
        """
        id = self.kwargs["author_id"]
        event = self.kwargs["event"].replace("-", " ").title()
        eventFixedKm = event.replace("Km", "km")
        eventFixedM = eventFixedKm.replace("0M", "0m")
        eventFixedMin = eventFixedM.replace(" Min", " min")
        queryset = Record.objects.filter(author_id=id, event=eventFixedMin).order_by("date").reverse()
        return queryset
