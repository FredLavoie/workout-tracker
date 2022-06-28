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
        id = self.kwargs['author_id']
        workouts = Workout.objects.filter(author_id=id)
        return workouts


class WorkoutDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        workout_details = Workout.objects.filter(author_id=id)
        return workout_details


class WorkoutListMonth(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        dt = self.kwargs['year_month']
        workouts = Workout.objects.filter(author_id=id, date__contains=dt)
        return workouts


class WorkoutListYear(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        dt = self.kwargs['year']
        workouts = Workout.objects.filter(author_id=id, date__contains=dt)
        return workouts


class WorkoutSearch(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        query = self.request.GET.get('q', '')
        id = self.kwargs['author_id']

        object_list = Workout.objects.annotate(
            search=SearchVector('workout_body')
        ).filter(
            search=SearchQuery(query)
        ).filter(
            author_id=id
        )

        return object_list


class WorkoutTotalPerYear(generics.ListAPIView):
    """
    Get the total number of workouts per year
    for each year that has workouts
    """
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutCountSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        queryset = Workout.objects.filter(
            author_id=id
        ).values(
            year=F('date__year')
        ).annotate(
            count=Count('date__year')
        ).order_by('date__year')

        return queryset
