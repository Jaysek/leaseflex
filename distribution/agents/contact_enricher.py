"""
Agent 2 — Contact Enricher
Finds property managers / asset managers at target buildings using:
  1. Apollo.io API (primary — best for B2B contact data)
  2. Website scraping (fallback)
  3. Manual entry via CLI
"""

import httpx
from bs4 import BeautifulSoup
import re
import time
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import get_buildings, insert_contact, update_building
from utils.config import TARGET_CITIES

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

TARGET_TITLES = [
    'property manager', 'asset manager', 'head of leasing',
    'director of operations', 'managing director', 'leasing manager',
    'leasing director', 'regional manager', 'vp of operations',
    'general manager', 'community manager', 'director of leasing',
    'vice president', 'chief operating officer',
]

APOLLO_API_KEY = os.getenv('APOLLO_API_KEY', '')


def search_apollo(company: str, city: str = None) -> list:
    """Search Apollo.io for contacts at a company with relevant titles."""
    if not APOLLO_API_KEY:
        return []

    contacts = []
    url = 'https://api.apollo.io/v1/mixed_people/search'

    headers = {
        'X-Api-Key': APOLLO_API_KEY,
        'Content-Type': 'application/json',
    }

    # Search for people with relevant titles at this company
    payload = {
        'q_organization_name': company,
        'person_titles': [
            'Property Manager', 'Asset Manager', 'Head of Leasing',
            'Director of Operations', 'Managing Director', 'Leasing Director',
            'Regional Manager', 'VP of Operations', 'General Manager',
            'Director of Leasing', 'Vice President Leasing',
        ],
        'per_page': 10,
        'page': 1,
    }

    if city:
        payload['person_locations'] = [city]

    try:
        resp = httpx.post(url, json=payload, headers=headers, timeout=15)
        if resp.status_code != 200:
            print(f"  Apollo API error: {resp.status_code}")
            return []

        data = resp.json()
        people = data.get('people', [])

        for person in people:
            contact = {
                'full_name': f"{person.get('first_name', '')} {person.get('last_name', '')}".strip(),
                'title': person.get('title', ''),
                'email': person.get('email', ''),
                'linkedin_url': person.get('linkedin_url', ''),
                'source': 'apollo',
            }
            if contact['full_name'] and contact['full_name'] != ' ':
                contacts.append(contact)

        print(f"  Apollo: found {len(contacts)} contacts")

    except Exception as e:
        print(f"  Apollo error: {e}")

    return contacts


def extract_emails_from_website(url: str) -> list:
    """Scrape a website for email addresses."""
    contacts = []
    try:
        resp = httpx.get(url, headers=HEADERS, timeout=10, follow_redirects=True)
        if resp.status_code != 200:
            return []

        # Extract emails
        emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resp.text)
        filtered = set()
        for email in emails:
            email = email.lower()
            if not any(skip in email for skip in [
                'example.com', 'sentry', 'webpack', '.png', '.jpg',
                'wixpress', 'schema.org', 'googleapis', 'cloudflare',
                'noreply', 'no-reply', '@w3.org',
            ]):
                filtered.add(email)

        # Also try common contact pages
        base = url.rstrip('/')
        for path in ['/contact', '/about', '/team', '/leadership']:
            try:
                page_resp = httpx.get(f"{base}{path}", headers=HEADERS, timeout=8, follow_redirects=True)
                if page_resp.status_code == 200:
                    page_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', page_resp.text)
                    for email in page_emails:
                        email = email.lower()
                        if not any(skip in email for skip in [
                            'example.com', 'sentry', 'webpack', '.png',
                            'wixpress', 'schema.org', '@w3.org',
                        ]):
                            filtered.add(email)
                time.sleep(1)
            except Exception:
                continue

        for email in filtered:
            contacts.append({
                'full_name': 'Unknown',
                'email': email,
                'source': 'website',
            })

    except Exception as e:
        print(f"  Website scrape error: {e}")

    return contacts


def add_manual_contact(building_id: str):
    """Interactively add a contact from the CLI."""
    print("\n  Add contact manually:")
    full_name = input("    Full name: ").strip()
    if not full_name:
        print("    Skipped")
        return None

    email = input("    Email: ").strip()
    title = input("    Title (e.g. Property Manager): ").strip()
    linkedin = input("    LinkedIn URL (optional): ").strip()

    contact = {
        'building_id': building_id,
        'full_name': full_name,
        'email': email or None,
        'title': title or None,
        'linkedin_url': linkedin or None,
        'source': 'manual',
        'status': 'new',
    }

    try:
        result = insert_contact(contact)
        print(f"    ✓ Added {full_name}")
        return result
    except Exception as e:
        print(f"    ✗ Error: {e}")
        return None


def run(limit: int = 50, use_apollo: bool = True):
    """Enrich all 'new' buildings with contacts."""
    buildings = get_buildings(status='new', limit=limit)

    if not buildings:
        print("No new buildings to enrich. Run seed or lead_sourcer first.")
        return 0

    if use_apollo and not APOLLO_API_KEY:
        print("Note: APOLLO_API_KEY not set. Using website scraping only.")
        print("For better results, get a free key at app.apollo.io\n")
        use_apollo = False

    print(f"Enriching {len(buildings)} buildings...\n")
    total_contacts = 0

    for building in buildings:
        name = building['name']
        city = building['city']
        company = building.get('company') or name
        property_url = building.get('property_url')

        print(f"\n{'─'*40}")
        print(f"Building: {name} ({city})")

        contacts = []

        # Method 1: Apollo.io (best for B2B)
        if use_apollo:
            apollo_contacts = search_apollo(company, city)
            contacts.extend(apollo_contacts)
            time.sleep(1)  # Rate limit

        # Method 2: Website scraping (fallback)
        if not contacts and property_url:
            print(f"  Scraping website: {property_url}")
            website_contacts = extract_emails_from_website(property_url)
            contacts.extend(website_contacts)
            print(f"  Website: found {len(website_contacts)} emails")

        # Save contacts
        saved = 0
        for contact in contacts:
            contact['building_id'] = building['id']
            contact['status'] = 'new'
            try:
                insert_contact(contact)
                saved += 1
            except Exception as e:
                print(f"  Error saving contact: {e}")

        # Update building status
        new_status = 'enriched' if saved > 0 else 'new'
        update_building(building['id'], {'status': new_status})

        print(f"  Total saved: {saved} contacts")
        total_contacts += saved
        time.sleep(1)

    print(f"\n{'='*50}")
    print(f"Total contacts found: {total_contacts}")
    print(f"{'='*50}")
    return total_contacts


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Contact Enricher — find people at buildings')
    parser.add_argument('--limit', type=int, default=50, help='Max buildings to enrich')
    parser.add_argument('--no-apollo', action='store_true', help='Skip Apollo, use website scraping only')
    args = parser.parse_args()

    # Reload env since we might be running standalone
    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(Path(__file__).parent.parent / '.env')
    APOLLO_API_KEY = os.getenv('APOLLO_API_KEY', '')

    run(limit=args.limit, use_apollo=not args.no_apollo)
