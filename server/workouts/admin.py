from django.contrib import admin
from .models import Workout


class WorkoutAdmin(admin.ModelAdmin):
    list_display = (
                    'id', 'author', 'date', 'time', 'workout_body',
                    'created_at', 'updated_at',
                    )


admin.site.register(Workout, WorkoutAdmin)
