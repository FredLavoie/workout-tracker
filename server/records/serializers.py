from rest_framework import serializers
from .models import Record


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("id", "author", "date", "type", "event", "score", "created_at", "updated_at")
        model = Record

    def validate(self, data):
        """
        Confirm that the record type is valid and the event exists for this type
        """
        types = Record.RECORD_TYPE_EVENT_LIST.keys()
        if data["type"] not in types:
            raise serializers.ValidationError("Record type is not valid choice")

        event_list = Record.RECORD_TYPE_EVENT_LIST[data["type"]]
        if data["event"] not in event_list:
            raise serializers.ValidationError("Not a valid event for this record type")

        return data
