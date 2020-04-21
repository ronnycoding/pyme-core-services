import stripe
from consumopymecr.utils.utils import get_env_value

def get_client():
    stripe.api_key = get_env_value('STRIPE_SECRET_KEY')
    return stripe