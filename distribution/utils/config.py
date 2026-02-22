import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from distribution directory
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '')
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'justin@leaseflex.com')
DAILY_EMAIL_LIMIT = int(os.getenv('DAILY_EMAIL_LIMIT', '50'))
TARGET_CITIES = [c.strip() for c in os.getenv('TARGET_CITIES', 'New York').split(',')]
