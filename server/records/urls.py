from django.urls import path
from .views import RecordList

urlpatterns = [
    path('<int:author_id>/records/', RecordList.as_view()),
]