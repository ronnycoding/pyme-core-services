import graphene
from graphene_django import DjangoObjectType

from users.models import CustomUser
from users.helpers import get_user_email_by_auth_token_header, get_jwt_object
from consumopymecr.stripe_api.client import get_client

from .models import UserCharge

class CancelReasonEnum(graphene.Enum):
    DUPLICATE = 'duplicate'
    FRAUDULENT = 'fraudulent'
    REQUESTED_BY_CUSTOMER = 'requested_by_customer'
    ABANDONED = 'abandoned'


class UserChargeObjectType(DjangoObjectType):
    class Meta:
        model = UserCharge
        fields = ('id', 'currency', 'amount',)


class CancelPaymentIntent(graphene.Mutation):
    ok = graphene.Boolean(default_value=False)

    class Arguments:
        order_id = graphene.Int(required=True)
        cancel_reason = graphene.String(required=True)

    def mutate(self, info, order_id, cancel_reason):
        """
        :param info:
        :param order_id:
        :param cancel_reason:
        :return:
        """

        """
            verify user authentication    
        """
        user = get_jwt_object(headers=info.context)
        customer = CustomUser.objects.get(pk=user.pk)
        if customer.user_type != 'MA':
            raise ValueError('Permission not authorized')


        """
            TODO: add validation options cancel_reason or look the way to implement enum graphene
        """

        """
            get charge by order_id
        """
        user_charge = UserCharge.objects.get(order_id=order_id)

        """
            initialize stripe client
        """
        stripe = get_client()

        stripe.PaymentIntent.cancel(
            user_charge.payment_intent,
            cancellation_reason=cancel_reason
        )

        return CancelPaymentIntent(ok=True)


class ConfirmPaymentIntent(graphene.Mutation):
    ok = graphene.Boolean(default_value=False)

    class Arguments:
        order_id = graphene.Int(required=True)

    def mutate(self, info, order_id):
        """
        :param info:
        :param order_id:
        :return:
        """

        """
            verify user authentication    
        """
        user = get_jwt_object(headers=info.context)
        customer = CustomUser.objects.get(pk=user.pk)
        if customer.user_type != 'MA':
            raise ValueError('Permission not authorized')

        """
            get charge by order_id
        """
        user_charge = UserCharge.objects.get(order_id=order_id)

        """
            initialize stripe client
        """
        stripe = get_client()

        stripe.PaymentIntent.confirm(
            user_charge.payment_intent,
            payment_method=user_charge.user_card.payment_method_id,
        )

        return ConfirmPaymentIntent(ok=True)



class CreateCharge(graphene.Mutation):
    user_charge = graphene.Field(UserChargeObjectType)
    ok = graphene.Boolean(default_value=False)

    class Arguments:
        card_id = graphene.Int(required=True)
        order_id = graphene.Int(required=True)


    def mutate(self, info, card_id, order_id):
        """
        :param info:
        :param card_id:
        :param amount:
        :param currency:
        :return:
        """

        """
            verify user authentication    
        """
        email = get_user_email_by_auth_token_header(headers=info.context)

        """
            retrieve order by order_id to get info
            (total_amount, currency)
            from hasura or fail
        """
        amount = 1100
        currency = 'usd'

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
            create payment intent
        """
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            payment_method_types=["card"],
            customer=user.stripe_customer.customer_id,
            payment_method=card.payment_method_id,
            confirm=True,
        )


        # """
        #     confirm payment intent
        # """
        # stripe.PaymentIntent.confirm(
        #     payment_intent.get('id'),
        #     payment_method=card.payment_method_id,
        # )
        #
        # """
        #     capture payment intent
        # """
        # stripe.PaymentIntent.capture(
        #     payment_intent.get('id'),
        # )


        """
           record user charge 
        """
        user_charge = UserCharge(
            user=user,
            user_card=card,
            currency=payment_intent.get('currency'),
            amount=payment_intent.get('amount'),
            amount_received=payment_intent.get('amount_received'),
            amount_capturable=payment_intent.get('amount_capturable'),
            payment_intent=payment_intent.get('id'),
        )
        user_charge.save()

        return CreateCharge(user_charge=user_charge, ok=True)
