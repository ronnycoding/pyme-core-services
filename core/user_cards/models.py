from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from fernet_fields import EncryptedTextField
from django.utils import timezone

from users.models import CustomUser

class UserCard(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE
    number = EncryptedTextField()
    exp_month = models.CharField(max_length=2)
    exp_year = models.CharField(max_length=4)
    cvc = models.CharField(max_length=4)
    last_four_digits = models.CharField(max_length=4)
    brand = models.CharField(max_length=24)
    payment_method_id = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)