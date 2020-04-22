from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from django.utils import timezone

from users.models import CustomUser
from user_cards.models import UserCard

class UserCharge(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE
    amount = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    amount_capturable = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    amount_received = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    user_card = models.ForeignKey(UserCard, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    update_at = models.DateTimeField(null=True)
    payment_intent = models.CharField(max_length=128, null=True)
    status = models.CharField(max_length=48, null=True)
    currency = models.CharField(max_length=3, null=True)
    ## order_id connected with hasura