# Generated by Django 3.2 on 2021-05-01 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='workout',
            name='time',
            field=models.TimeField(default='12:00:00'),
        ),
        migrations.AlterField(
            model_name='workout',
            name='date',
            field=models.DateField(),
        ),
    ]
