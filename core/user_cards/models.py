from django.db import models
from fernet_fields import EncryptedTextField

from users.models import CustomUser

class UserCard(models.Model):
    number = EncryptedTextField()
    exp_month = models.CharField(max_length=2)
    exp_year = models.CharField(max_length=4)
    cvc = models.CharField(max_length=4)
    last_four_digits = models.CharField(max_length=4)
    payment_method_id = models.CharField(max_length=128)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)