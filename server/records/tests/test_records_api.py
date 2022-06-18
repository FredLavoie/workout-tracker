from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from ..models import Record
from ..serializers import RecordSerializer


class RecordAPITests(TestCase):
    """
    Test the Record API
    """
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@email.com',
            password='secret11%',
        )
        self.client.force_authenticate(self.user)
        self.RECORDS_URL = reverse('records', args=[self.user.id])

        Record.objects.create(
            author=self.user,
            date='2022-06-08',
            type='Strength',
            event='Clean',
            score='250',
            )
        Record.objects.create(
            author=self.user,
            date='2022-12-14',
            type='Endurance',
            event='Run 5km',
            score='20:04',
            )

        self.user2 = get_user_model().objects.create_user(
            username='testuser2',
            email='test2@email.com',
            password='ssdfs11%',
        )

        Record.objects.create(
            author=self.user2,
            date='2022-12-14',
            type='Endurance',
            event='Run 5km',
            score='20:04',
            )

    def test_retrieve_records_list(self):
        """
        Test retrieving a list of records
        """
        # make API call
        res = self.client.get(self.RECORDS_URL)
        # assert that the request was successful
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # gather the records
        records = Record.objects.all().filter(author=self.user)
        serializer = RecordSerializer(records, many=True)
        # assert that the API response match the Record query object
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_records_limited_to_user(self):
        """
        Test retrieving a list of records that belong to user 1
        """
        # make API call
        res = self.client.get(self.RECORDS_URL)
        # assert that the request was successful
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # assert that the filtered records contains 2 records
        self.assertEqual(len(res.data), 2)
        # gather records
        records = Record.objects.all().filter(author=self.user)
        serializer = RecordSerializer(records, many=True)
        # assert that the API response match the filtered Record query object
        self.assertEqual(res.data, serializer.data)
        # assert that the API response is contains data for the specified user
        self.assertEqual(res.data[0]['author'], self.user.id)

    def test_retrieve_records_limited_to_user2(self):
        """
        Test retrieving a list of records that belong to user 2
        """
        # URL for user 2
        self.client.force_authenticate(self.user2)
        RECORDS_URL_2 = reverse('records', args=[self.user2.id])
        # make API call
        res = self.client.get(RECORDS_URL_2)
        # assert that the request was successful
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # assert that the filtered records contains 1 record
        self.assertEqual(len(res.data), 1)
        # gather records
        records = Record.objects.all().filter(author=self.user2)
        serializer = RecordSerializer(records, many=True)
        # assert that the API response match the filtered Record query object
        self.assertEqual(res.data, serializer.data)
        # assert that the API response is contains data for the specified user
        self.assertEqual(res.data[0]['author'], self.user2.id)
