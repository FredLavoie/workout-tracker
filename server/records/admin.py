from django.contrib import admin
from .models import Record


class RecordAdmin(admin.ModelAdmin):
    list_display = (
                    "id", "author", "date", "type", "event",
                    "score", "created_at", "updated_at",
                    )


admin.site.register(Record, RecordAdmin)
