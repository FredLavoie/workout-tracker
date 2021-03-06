# Generated by Django 3.2 on 2021-05-03 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0002_record_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='event',
            field=models.CharField(choices=[('back_squat', 'Back Squat'), ('front_squat', 'Front Squat'), ('deadlift', 'Deadlift'), ('press', 'press'), ('push_press', 'Push Press'), ('clean', 'Clean'), ('power_clean', 'Power Clean'), ('clean_and_jerk', 'Clean & Jerk'), ('push_jerk', 'Push Jerk'), ('bench_press', 'Bench Press'), ('thruster', 'Thruster'), ('row_500', 'Row 500m'), ('row_1000', 'Row 1,000m'), ('row_2000', 'Row 2,000m'), ('row_5000', 'Row 5,000m'), ('row_10000', 'Row 10,000m'), ('bike_erg_30', 'Bike Erg 30 min'), ('bike_erg_60', 'Bike Erg 60 min'), ('bike_erg_marathon', 'Bike Erg marathon'), ('run_5k', 'Run 5km'), ('run_10k', 'Run 10km'), ('murph', 'Murph'), ('cindy', 'Cindy'), ('grace', 'Grace'), ('isabelle', 'Isabelle')], max_length=100),
        ),
    ]
