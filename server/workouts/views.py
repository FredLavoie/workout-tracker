# from django.contrib.auth.decorators import login_required
from rest_framework import generics
from .models import Workout
from .serializers import WorkoutSerializer

class WorkoutList(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer

    # @login_required
    def get_queryset(self):
        id = self.kwargs['author_id']
        workouts = Workout.objects.filter(author_id=id)
        return workouts 


class WorkoutDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkoutSerializer

    # @login_required
    def get_queryset(self):
        id = self.kwargs['author_id']
        workout = Workout.objects.filter(author_id=id)
        return workout


class WorkoutListMonth(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer

    # @login_required
    def get_queryset(self):
        id = self.kwargs['author_id']
        dt = self.kwargs['year_month']
        workout = Workout.objects.filter(author_id=id, date__contains=dt)
        return workout
