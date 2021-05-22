from django.urls import path
from .views import WorkoutList, WorkoutDetail, WorkoutListMonth, WorkoutSearch

urlpatterns = [
    path('<int:author_id>/workouts/<uuid:pk>/', WorkoutDetail.as_view()),
    path('<int:author_id>/workouts/', WorkoutList.as_view()),
    path('<int:author_id>/cal/<year_month>/', WorkoutListMonth.as_view()),
    path('<int:author_id>/workouts/search/', WorkoutSearch.as_view()),
]
