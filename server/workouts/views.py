from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Workout
from .permissions import IsAuthor
from .serializers import WorkoutSerializer

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
        workout = Workout.objects.filter(author_id=id)
        return workout


class WorkoutListMonth(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAuthor,)
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        dt = self.kwargs['year_month']
        workout = Workout.objects.filter(author_id=id, date__contains=dt)
        return workout
