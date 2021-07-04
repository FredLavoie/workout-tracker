from django.urls import path
from .views import RecordList, RecordDetail, RecordSearch, EventRecordList

urlpatterns = [
    path('<int:author_id>/records/event/<str:event>/', EventRecordList.as_view()),
    path('<int:author_id>/records/<uuid:pk>/', RecordDetail.as_view()),
    path('<int:author_id>/records/search/', RecordSearch.as_view()),
    path('<int:author_id>/records/', RecordList.as_view()),
]
