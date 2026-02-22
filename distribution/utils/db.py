from supabase import create_client
from .config import SUPABASE_URL, SUPABASE_KEY

_client = None

def get_db():
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client


def insert_building(data: dict) -> dict:
    """Insert a building, skip if duplicate by name + city."""
    db = get_db()
    existing = db.table('buildings').select('id').eq('name', data['name']).eq('city', data['city']).execute()
    if existing.data:
        return existing.data[0]
    result = db.table('buildings').insert(data).execute()
    return result.data[0] if result.data else {}


def insert_contact(data: dict) -> dict:
    """Insert a contact, skip if duplicate by email."""
    db = get_db()
    if data.get('email'):
        existing = db.table('contacts').select('id').eq('email', data['email']).execute()
        if existing.data:
            return existing.data[0]
    result = db.table('contacts').insert(data).execute()
    return result.data[0] if result.data else {}


def insert_outreach_email(data: dict) -> dict:
    db = get_db()
    result = db.table('outreach_emails').insert(data).execute()
    return result.data[0] if result.data else {}


def get_buildings(status: str = None, city: str = None, limit: int = 100) -> list:
    db = get_db()
    query = db.table('buildings').select('*')
    if status:
        query = query.eq('status', status)
    if city:
        query = query.eq('city', city)
    result = query.limit(limit).execute()
    return result.data or []


def get_contacts(status: str = None, building_id: str = None, limit: int = 100) -> list:
    db = get_db()
    query = db.table('contacts').select('*, buildings(*)')
    if status:
        query = query.eq('status', status)
    if building_id:
        query = query.eq('building_id', building_id)
    result = query.limit(limit).execute()
    return result.data or []


def get_outreach_emails(status: str = None, contact_id: str = None, limit: int = 100) -> list:
    db = get_db()
    query = db.table('outreach_emails').select('*, contacts(*), buildings(*)')
    if status:
        query = query.eq('status', status)
    if contact_id:
        query = query.eq('contact_id', contact_id)
    result = query.order('created_at', desc=True).limit(limit).execute()
    return result.data or []


def update_building(building_id: str, data: dict):
    db = get_db()
    db.table('buildings').update(data).eq('id', building_id).execute()


def update_contact(contact_id: str, data: dict):
    db = get_db()
    db.table('contacts').update(data).eq('id', contact_id).execute()


def update_outreach_email(email_id: str, data: dict):
    db = get_db()
    db.table('outreach_emails').update(data).eq('id', email_id).execute()
