# from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse

from rest_framework import generics
from .models import Workout
from .serializers import WorkoutSerializer

class WorkoutList(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer

    def get_queryset(self):
        id = self.kwargs['author_id']
        workouts = Workout.objects.filter(author_id=id)
        return workouts 


class WorkoutDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer