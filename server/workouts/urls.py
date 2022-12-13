from django.urls import path
from .views import (WorkoutList, WorkoutDetail, WorkoutListMonth,
                    WorkoutSearch, WorkoutListYear, WorkoutTotalPerYear)

urlpatterns = [
    path('<int:author_id>/workouts/<uuid:pk>/', WorkoutDetail.as_view()),
    path('<int:author_id>/workouts/', WorkoutList.as_view(), name='workouts'),
    path('<int:author_id>/cal/<year_month>/', WorkoutListMonth.as_view()),
    path('<int:author_id>/workouts/<int:year>/', WorkoutListYear.as_view()),
    path('<int:author_id>/workouts/search/', WorkoutSearch.as_view()),
    path('<int:author_id>/workouts/total-per-year/', WorkoutTotalPerYear.as_view()),
    path('<int:author_id>/workouts/diferent-path-testing/', WorkoutTotalPerYear.as_view()),
]
