import graphene
import graphql_jwt

from users.schema import CreateUser, User
from user_cards.schema import CreateCard

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_card = CreateCard.Field()

class Query(graphene.ObjectType):
    viewer = graphene.Field(User, token=graphene.String(required=True))

schema = graphene.Schema(mutation=Mutation, query=Query)