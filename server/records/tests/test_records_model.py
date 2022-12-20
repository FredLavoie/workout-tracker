from django.test import TestCase
from django.contrib.auth import get_user_model

from ..models import Record


class RecordModelTests(TestCase):
    """
    Test the Record model
    """
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@email.com",
            password="secret11%",
        )

        cls.record = Record.objects.create(
            author=cls.user,
            date="2022-06-08",
            type="Strength",
            event="Clean",
            score="250",
        )

    def test_model_content(self):
        self.assertEqual(self.record.author.username, "testuser")
        self.assertEqual(self.record.date, "2022-06-08",)
        self.assertEqual(self.record.type, "Strength")
        self.assertEqual(self.record.event, "Clean")
        self.assertEqual(self.record.score, "250")
