import uuid

from django.db import models
from django.conf import settings

PR_CHOICES = (
    # strength lifts
    ('back_squat','Back Squat'),
    ('front_squat', 'Front Squat'),
    ('deadlift','Deadlift'),
    ('press','press'),
    ('push_press','Push Press'),
    ('clean','Clean'),
    ('power_clean','Power Clean'),
    ('clean_and_jerk','Clean & Jerk'),
    ('push_jerk','Push Jerk'),
    ('bench_press','Bench Press'),
    ('thruster','Thruster'),
    # endurance
    ('row_500','Row 500m'),
    ('row_1000','Row 1,000m'),
    ('row_2000','Row 2,000m'),
    ('row_5000','Row 5,000m'),
    ('row_10000','Row 10,000m'),
    ('bike_erg_30','Bike Erg 30 min'),
    ('bike_erg_60','Bike Erg 60 min'),
    ('bike_erg_marathon','Bike Erg marathon'),
    ('run_5k','Run 5km'),
    ('run_10k','Run 10km'),
    # WODs
    ('murph','Murph'),
    ('cindy','Cindy'),
    ('grace','Grace'),
    ('isabelle','Isabelle'),
)

class Record(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    date = models.DateField()
    event = models.CharField(max_length=100, choices=PR_CHOICES)
    score = models.CharField(max_length=100, default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return (f"{self.author} ({self.date}) - {self.event}")
