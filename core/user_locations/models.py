from django.db import models
from django.utils import timezone

from users.models import CustomUser


class UserLocation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    country_code = models.CharField(max_length=2, null=True)
    latitude = models.CharField(max_length=128, null=True)
    longitude = models.CharField(max_length=128, null=True)
    ip = models.CharField(max_length=128, null=True)
