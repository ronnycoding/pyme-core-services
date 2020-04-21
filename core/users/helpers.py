from graphql_jwt.utils import jwt_payload
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view
from django.http import JsonResponse

from users.models import CustomUser
from consumopymecr.utils.utils import get_env_value

@api_view(['POST'])
def generate_anonymous_token(request):
    user = CustomUser(email=get_env_value('ANONYMOUS_USER_EMAIL'))
    refresh = CustomTokenObtainPairSerializer.get_token(user=user)
    response_data = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    return JsonResponse(response_data)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        if user.email == get_env_value('ANONYMOUS_USER_EMAIL'):
            token['https://hasura.io/jwt/claims'] = {
                'X-Hasura-Allowed-Roles': ['anonymous'],
                'X-Hasura-Default-Role': 'anonymous',
            }
        else:
            token = jwt_custom_payload_handler(user, token)

        # if 'user_id' in token:
        #     del token['user_id']

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

def jwt_custom_payload_handler(user, token):
    token['https://hasura.io/jwt/claims'] = {
        'X-Hasura-Allowed-Roles': [str(user.user_type)],
        'X-Hasura-Default-Role': str(user.user_type),
        'X-Hasura-User-Id': str(user.hasura_id),
    }

    return token

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_user_email_by_auth_token_header(headers):
    header = JWTAuthentication.get_header(JWTAuthentication, request=headers)
    raw_token = JWTAuthentication.get_raw_token(JWTAuthentication, header=header)
    validated_token = JWTAuthentication.get_validated_token(JWTAuthentication, raw_token=raw_token)
    user_email = JWTAuthentication.get_user(JWTAuthentication, validated_token=validated_token)
    return user_email