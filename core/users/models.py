from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from stripe_customers.models import StripeCustomer
from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin, SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE
    class UserType(models.TextChoices):
        DELIVERYMAN = 'DM', _('Delivery Man')
        CUSTOMER = 'CU', _('Customer')
        STORE_OWNER = 'SO', _('Store Owner')

    email = models.EmailField(_('email address'), unique=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=128, null=True)
    last_name = models.CharField(max_length=128, null=True)
    username = models.CharField(max_length=128, null=True)
    is_staff = models.BooleanField(default=False)
    update_at = models.DateTimeField(null=True)
    user_type = models.CharField(
        max_length=2,
        choices=UserType.choices,
        default=UserType.CUSTOMER,
    )
    hasura_id = models.CharField(max_length=128, null=True)
    stripe_customer = models.OneToOneField(
        StripeCustomer,
        on_delete=models.CASCADE,
        null=True,
    )


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email