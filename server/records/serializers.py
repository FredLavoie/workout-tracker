from rest_framework import serializers
from .models import Record


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("id", "author", "date", "type", "event", "score", "created_at", "updated_at")
        model = Record
