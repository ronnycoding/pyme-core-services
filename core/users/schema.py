import graphene
from graphene_django import DjangoObjectType
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from django.contrib.gis.geoip2 import GeoIP2
from django.contrib.auth import get_user_model

from user_locations.models import UserLocation
from users.models import CustomUser
from stripe_customers.models import StripeCustomer
from .managers import CustomUserManager
from consumopymecr.stripe_api.client import get_client
from consumopymecr.utils.utils import get_env_value
from users.helpers import get_client_ip

class User(DjangoObjectType):
    class Meta:
        model = CustomUser


class CreateUser(graphene.Mutation):
    user = graphene.Field(User)

    class Arguments:
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        user_type = graphene.String(required=False)

    def mutate(self, info, email, password, first_name, last_name, user_type='CU'):
        email = CustomUserManager.normalize_email(email)

        """
            create stripe_api customer associated to a user
        """
        stripe = get_client()
        print(stripe)
        stripe_customer_object = stripe.Customer.create(
            email=email,
        )
        stripe_customer = StripeCustomer(customer_id=stripe_customer_object.get('id'))
        stripe_customer.save()

        """
           create user on hasura engine 
        """
        _transport = RequestsHTTPTransport(
            url=get_env_value('HASURA_GRAPHQL_ENDPOINT'),
            use_json=True,
            headers={
                'x-hasura-admin-secret': get_env_value('HASURA_GRAPHQL_ADMIN_SECRET'),
                'content-type': 'application/json',
            }
        )

        client = Client(
            transport=_transport,
            fetch_schema_from_transport=True,
        )

        params = {
            'email': email,
        }

        query = gql("""
            mutation CreateUser($email: String!) {
              insert_users(objects: {email: $email}) {
                affected_rows
              }
            }
        """)

        client.execute(query, variable_values=params)

        query = gql("""
            query GetUserCreated($email: String!) {
                users(where: {email: {_eq: $email}}) {
                    id
                }
            }
        """)

        result_query = client.execute(query, variable_values=params)

        """
            create a user
        """
        user = get_user_model()(
            email=email,
            first_name=first_name,
            last_name=last_name,
            hasura_id=result_query.get('users')[0].get('id'),
            user_type=user_type,
            stripe_customer=stripe_customer,
        )
        user.set_password(password)
        user.save()

        """
            create location related to user
        """
        ip = get_client_ip(info.context)
        try:
            g = GeoIP2()
            loc = g.city(ip)
            user_loc = UserLocation(user=user, ip=ip, country_code=loc.get('country_code'),
                                    latitude=loc.get('latitude'), longitude=loc.get('longitude'))
        except:
            user_loc = UserLocation(user=user, ip=ip)

        user_loc.save()

        return CreateUser(user=user)
