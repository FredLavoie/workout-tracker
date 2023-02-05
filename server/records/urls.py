from django.urls import path
from .views import RecordList, RecordDetail, RecordSearch, EventRecordList, get_all_event_choices

urlpatterns = [
    # Get, Update or Delete a single record
    path("<int:author_id>/records/<uuid:pk>/", RecordDetail.as_view()),
    # Get all records that match the search query
    path("<int:author_id>/records/search/", RecordSearch.as_view()),
    # Create new record and get the newest record for each event type for a user
    path("<int:author_id>/records/", RecordList.as_view(), name="records"),
    # Get all records for a user and an event type
    path("<int:author_id>/records/event/<str:event>/", EventRecordList.as_view()),
    # Get the record type and event list as a dictionary
    path("records/event-list/", get_all_event_choices),
]
