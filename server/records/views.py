from django.contrib.postgres.search import SearchVector, SearchQuery
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from .models import Record
from .permissions import IsAuthor
from .serializers import RecordSerializer
from .utils import latest_record_for_event


class RecordList(generics.ListCreateAPIView):
    """
    Create new record
    Get latest record for each event type
    """
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        """
        Get the latest record for each event type
        Returns a single record for each event type
        """
        id = self.kwargs["author_id"]
        queryset = Record.objects.filter(author_id=id).order_by("event")
        queryset = latest_record_for_event(queryset)
        return queryset


class RecordDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        arg_author_id = self.kwargs["author_id"]
        arg_record_id = self.kwargs["pk"]
        queryset = Record.objects.filter(author_id=arg_author_id, id=arg_record_id)
        return queryset


class RecordSearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        arg_author_id = self.kwargs["author_id"]

        queryset = Record.objects.annotate(
            search=SearchVector("type")+SearchVector("event")
        ).filter(
            search=SearchQuery(query)
        ).filter(
            author_id=arg_author_id
        )

        return queryset


class EventRecordList(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = RecordSerializer

    def get_queryset(self):
        """
        Get the list of records for a specific event
        Return results sorted in reverse chronological order
        """
        id = self.kwargs["author_id"]
        event = self.kwargs["event"]
        queryset = Record.objects.filter(author_id=id, event=event).order_by("date").reverse()
        return queryset


@api_view(["GET"])
def get_all_event_choices(request):
    """
    API endpoint that returns the record type and event dictionary that the
    frontend uses for the type radio group and the event dropdown list
    """
    return Response(Record.RECORD_TYPE_EVENT_LIST, status=status.HTTP_200_OK)
