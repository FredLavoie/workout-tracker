from django.urls import path
from .views import RecordList, RecordDetail

urlpatterns = [
    path('<int:author_id>/records/<uuid:pk>/', RecordDetail.as_view()),
    path('<int:author_id>/records/', RecordList.as_view()),
]