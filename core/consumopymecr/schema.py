import graphene
import graphql_jwt

from users.schema import CreateUser, User
from users.models import CustomUser
from users.helpers import get_user_email_by_auth_token_header
from user_cards.schema import UserCardObjectType, CreateCard, DeleteCard
from user_charges.schema import CreateCharge


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_card = CreateCard.Field()
    delete_card = DeleteCard.Field()
    create_charge = CreateCharge.Field()


class Query(graphene.ObjectType):
    user_cards = graphene.List(UserCardObjectType)


    def resolve_user_cards(self, info, **kwargs):
        """
            verify user authentication
        """
        email = get_user_email_by_auth_token_header(headers=info.context)

        """
            get user
        """
        user = CustomUser.objects.filter(email=email).first()

        """
        """
        return user.usercard_set.filter(is_active=True)


schema = graphene.Schema(mutation=Mutation, query=Query)