import uuid

from django.db import models
from django.conf import settings


class Record(models.Model):

    RECORD_TYPE_EVENT_LIST = {
        "strength": [
            "Back Squat",
            "Bench Press",
            "Clean",
            "Clean & Jerk",
            "Deadlift",
            "Dead Hang",
            "Front Squat",
            "Press",
            "Push Press",
            "Power Clean",
            "Push Jerk",
            "Snatch",
            "Thruster",
        ],
        "endurance": [
            "10 min Air Bike",
            "30 min Air Bike",
            "Bike Erg 30 min",
            "Bike Erg 60 min",
            "Bike Erg Marathon",
            "Row 500m",
            "Row 1,000m",
            "Row 2,000m",
            "Row 5,000m",
            "Row 10,000m",
            "Run 5km",
            "Run 10km",
        ],
        "wod": [
            "Angie",
            "Cindy",
            "Diane",
            "DT",
            "Fight Gone Badge",
            "Filthy Fifty",
            "Fran",
            "Grace",
            "Helen",
            "Isabelle",
            "Jackie",
            "Linda",
            "Murph",
        ],
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    date = models.DateField()
    type = models.CharField(max_length=200, default="strength")
    event = models.CharField(max_length=100, default="")
    score = models.CharField(max_length=100, default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        unique_together = ["author", "date", "event", ]
