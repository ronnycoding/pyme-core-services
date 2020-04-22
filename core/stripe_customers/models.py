from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from django.db import models
from django.utils import timezone


class StripeCustomer(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE
    created_at = models.DateTimeField(default=timezone.now)
    customer_id = models.CharField(max_length=128, null=False)
    setup_intent = models.CharField(max_length=128, null=True)