from rest_framework import serializers
from .models import Workout

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'author', 'date', 'body', 'created_at', 'updated_at')
        model = Workout