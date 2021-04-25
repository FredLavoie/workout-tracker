from django.urls import path
from .views import WorkoutList, WorkoutDetail

urlpatterns = [
    path('<int:fk>/<uuid:pk>/', WorkoutDetail.as_view()),
    path('<int:fk>/', WorkoutList.as_view()),
]