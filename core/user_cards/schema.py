import graphene
from graphene_django import DjangoObjectType
from django.http import HttpResponse

from consumopymecr.stripe_api.client import get_client

from users.models import CustomUser
from users.helpers import get_user_email_by_auth_token_header
from .models import UserCard

class UserCardObjectType(DjangoObjectType):
    class Meta:
        model = UserCard
        fields = ('last_four_digits', 'brand', 'id')

class DeleteCard(graphene.Mutation):
    user_card = graphene.Field(UserCardObjectType)
    ok = graphene.Boolean(default_value=False)

    class Arguments:
        card_id = graphene.Int(required=True)

    def mutate(self, info, card_id):
        """
        :param info:
        :param card_id:
        :return:
        """

        """
            verify user authentication    
        """
        email = get_user_email_by_auth_token_header(headers=info.context)

        """
            initialize stripe client
        """
        stripe = get_client()

        """
            get user
        """
        user = CustomUser.objects.filter(email=email).first()

        """
            find user paymethod
        """
        card = user.usercard_set.filter(id=card_id).first()

        """
            detach paymethod of user
        """
        stripe.PaymentMethod.detach(card.payment_method_id)

        """
            get card by card_id and delete card
        """
        card.delete()

        return DeleteCard(user_card=card, ok=True)




class CreateCard(graphene.Mutation):
    user_card = graphene.Field(UserCardObjectType)
    ok = graphene.Boolean(default_value=False)

    class Arguments:
        number = graphene.String(required=True)
        exp_month = graphene.String(required=True)
        exp_year = graphene.String(required=True)
        cvc = graphene.String(required=True)

    def mutate(self, info, number, exp_month, exp_year, cvc):
        """
        :param info:
        :param number:
        :param exp_month:
        :param exp_year:
        :param cvc:
        :return:
        """

        """
            verify user authentication    
        """
        email = get_user_email_by_auth_token_header(headers=info.context)

        """
            initialize stripe client
        """
        stripe = get_client()

        """
            get user
        """
        user = CustomUser.objects.filter(email=email).first()

        """
            create payment method
        """
        payment_method = stripe.PaymentMethod.create(
            type="card",
            card={
                "number": number,
                "exp_month": int(exp_month),
                "exp_year": int(exp_year),
                "cvc": cvc,
            },
        )

        """
            create user card
        """
        user_card = UserCard(
            number=number,
            exp_month=exp_month,
            exp_year=exp_year,
            cvc=cvc,
            last_four_digits=payment_method.get('card').get('last4'),
            brand=payment_method.get('card').get('brand'),
            payment_method_id=payment_method.get('id'),
            user=user,
        )
        user_card.save()

        """
            Attach payment method to user
        """
        stripe.PaymentMethod.attach(
            user_card.payment_method_id,
            customer=user.stripe_customer.customer_id,
        )

        return CreateCard(user_card=user_card, ok=True)