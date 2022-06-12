from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Workout


class WorkoutModelTests(TestCase):
    """
    Test the Workout model
    """
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@email.com',
            password='secret11%',
        )

        cls.workout = Workout.objects.create(
            author = cls.user,
            date = '2022-06-08',
            time = '13:44',
            workout_body = 'test workout'
        )

    def test_model_content(self):
        self.assertEqual(self.workout.author.username, 'testuser')
        self.assertEqual(self.workout.date, '2022-06-08')
        self.assertEqual(self.workout.time, '13:44')
        self.assertEqual(self.workout.workout_body, 'test workout')
