import uuid

from django.db import models
from django.conf import settings


class Record(models.Model):
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
