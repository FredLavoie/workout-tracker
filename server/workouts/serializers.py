from rest_framework import serializers
from .models import Workout


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'author', 'date', 'time', 'workout_body', 'created_at', 'updated_at')
        model = Workout


class WorkoutCountSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField()
    count = serializers.IntegerField()

    class Meta:
        fields = ('year', 'count')
        model = Workout
