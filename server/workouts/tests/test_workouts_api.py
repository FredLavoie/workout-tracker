from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from ..models import Workout
from ..serializers import WorkoutSerializer


class WorkoutAPITests(TestCase):
    """
    Test the Workout API
    """
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@email.com",
            password="secret11%",
        )
        self.client.force_authenticate(self.user)
        self.WORKOUT_URL = reverse("workouts", args=[self.user.id])

        Workout.objects.create(
            author=self.user,
            date="2022-06-08",
            time="08:34",
            workout_body="(A) Endurance 60 min bike erg",
            )
        Workout.objects.create(
            author=self.user,
            date="2022-12-14",
            time="14:15",
            workout_body="(A) Endurance Run 5km",
            )

        self.user2 = get_user_model().objects.create_user(
            username="testuser2",
            email="test2@email.com",
            password="ssdfs11%",
        )

        Workout.objects.create(
            author=self.user2,
            date="2022-12-14",
            time="22:00",
            workout_body="(A) Back Squat 5x5",
            )

    def test_retrieve_workouts_list(self):
        """
        Test retrieving a list of workouts
        """
        # make API call
        res = self.client.get(self.WORKOUT_URL)
        # assert that the request was successful
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # assert that the filtered workouts contains 3 workouts
        self.assertEqual(len(res.data), 2)
        # gather the workouts
        workouts = Workout.objects.all().filter(author=self.user)
        serializer = WorkoutSerializer(workouts, many=True)
        # assert that the API response match the Workout query object
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_workouts_limited_to_user(self):
        """
        Test retrieving a list of workouts that belong to user 1
        """
        # make API call
        res = self.client.get(self.WORKOUT_URL)
        # assert that the request was successful
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # assert that the filtered workouts contains 2 workouts
        self.assertEqual(len(res.data), 2)
        # gather workouts
        workouts = Workout.objects.all().filter(author=self.user)
        serializer = WorkoutSerializer(workouts, many=True)
        # assert that the API response match the filtered Workout query object
        self.assertEqual(res.data, serializer.data)
        # assert that the API response is contains data for the specified user
        self.assertEqual(res.data[0]["author"], self.user.id)

    def test_retrieve_workouts_limited_to_user2(self):
        """
        Test retrieving a list of workouts that belong to user 2
        """
        # URL for user 2
        self.client.force_authenticate(self.user2)
        WORKOUT_URL_2 = reverse("workouts", args=[self.user2.id])
        # make API call
        res = self.client.get(WORKOUT_URL_2)
        # assert that the request was successful
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # assert that the filtered workouts contains 1 workout
        self.assertEqual(len(res.data), 1)
        # gather workouts
        workouts = Workout.objects.all().filter(author=self.user2)
        serializer = WorkoutSerializer(workouts, many=True)
        # assert that the API response match the filtered Workout query object
        self.assertEqual(res.data, serializer.data)
        # assert that the API response is contains data for the specified user
        self.assertEqual(res.data[0]["author"], self.user2.id)
