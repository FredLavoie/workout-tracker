from django.urls import path
from .views import AuthorDetail

urlpatterns = [
    path('accounts/<str:username>/', AuthorDetail.as_view()),
]
