from rest_framework import serializers
from .models import CustomUser


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'username', 'date_joined')
        model = CustomUser
