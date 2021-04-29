from django.urls import path
from .views import WorkoutList, WorkoutDetail

urlpatterns = [
    path('<int:author_id>/workouts/<uuid:pk>/', WorkoutDetail.as_view()),
    path('<int:author_id>/workouts/', WorkoutList.as_view()),
]