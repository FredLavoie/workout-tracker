from django.contrib.postgres.search import SearchVector, SearchQuery
from django.db.models import Count, F
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Workout
from .permissions import IsAuthor
from .serializers import WorkoutSerializer, WorkoutCountSerializer


class WorkoutList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        queryset = Workout.objects.filter(author_id=id)
        return queryset


class WorkoutDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        queryset = Workout.objects.filter(author_id=id)
        return queryset


class WorkoutListMonth(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        dt = self.kwargs["year_month"]
        queryset = Workout.objects.filter(author_id=id, date__contains=dt)
        return queryset


class WorkoutListYear(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        dt = self.kwargs["year"]
        queryset = Workout.objects.filter(author_id=id, date__contains=dt)
        return queryset


class WorkoutSearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        id = self.kwargs["author_id"]

        queryset = Workout.objects.annotate(
            search=SearchVector("workout_body")
        ).filter(
            search=SearchQuery(query)
        ).filter(
            author_id=id
        )

        return queryset


class WorkoutTotalPerYear(generics.ListAPIView):
    """
    Get the total number of workouts per year
    for each year that has workouts
    """
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutCountSerializer

    def get_queryset(self):
        id = self.kwargs["author_id"]
        queryset = Workout.objects.filter(
            author_id=id
        ).values(
            year=F("date__year")
        ).annotate(
            count=Count("date__year")
        ).order_by("date__year")

        return queryset
