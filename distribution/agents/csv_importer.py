"""
CSV Importer — Import contacts exported from Apollo, LinkedIn, or any CSV.

Expected columns (flexible — matches common exports):
  - First Name / first_name
  - Last Name / last_name
  - Name / Full Name / full_name
  - Email / email
  - Title / title
  - Company / company / Organization
  - LinkedIn URL / linkedin_url / Person Linkedin Url
  - City / city
  - State / state
"""

import csv
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import insert_building, insert_contact, get_db


def normalize_headers(headers: list) -> dict:
    """Map CSV headers to our internal field names."""
    mapping = {}
    for i, h in enumerate(headers):
        h_lower = h.strip().lower().replace(' ', '_')

        if h_lower in ('first_name', 'first'):
            mapping['first_name'] = i
        elif h_lower in ('last_name', 'last'):
            mapping['last_name'] = i
        elif h_lower in ('name', 'full_name', 'contact_name'):
            mapping['full_name'] = i
        elif h_lower in ('email', 'email_address', 'work_email'):
            mapping['email'] = i
        elif h_lower in ('title', 'job_title', 'position'):
            mapping['title'] = i
        elif h_lower in ('company', 'company_name', 'organization', 'organization_name', 'account_name'):
            mapping['company'] = i
        elif h_lower in ('linkedin_url', 'linkedin', 'person_linkedin_url', 'linkedin_profile'):
            mapping['linkedin_url'] = i
        elif h_lower in ('city', 'person_city', 'location_city'):
            mapping['city'] = i
        elif h_lower in ('state', 'person_state', 'location_state'):
            mapping['state'] = i
        elif h_lower in ('phone', 'phone_number', 'direct_phone'):
            mapping['phone'] = i

    return mapping


def run(csv_path: str, default_city: str = 'New York', default_state: str = 'NY'):
    """Import contacts from a CSV file."""
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return 0

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        headers = next(reader)
        mapping = normalize_headers(headers)

        print(f"Detected columns: {list(mapping.keys())}")
        print(f"Total columns in CSV: {len(headers)}\n")

        if 'email' not in mapping and 'full_name' not in mapping and 'first_name' not in mapping:
            print("ERROR: CSV must have at least an email or name column.")
            print(f"Found headers: {headers}")
            return 0

        imported = 0
        skipped = 0

        for row in reader:
            if not row or all(not cell.strip() for cell in row):
                continue

            # Extract name
            full_name = ''
            if 'full_name' in mapping:
                full_name = row[mapping['full_name']].strip()
            elif 'first_name' in mapping:
                first = row[mapping['first_name']].strip() if 'first_name' in mapping else ''
                last = row[mapping['last_name']].strip() if 'last_name' in mapping else ''
                full_name = f"{first} {last}".strip()

            if not full_name:
                full_name = 'Unknown'

            email = row[mapping['email']].strip().lower() if 'email' in mapping and mapping['email'] < len(row) else ''
            title = row[mapping['title']].strip() if 'title' in mapping and mapping['title'] < len(row) else ''
            company = row[mapping['company']].strip() if 'company' in mapping and mapping['company'] < len(row) else ''
            linkedin = row[mapping['linkedin_url']].strip() if 'linkedin_url' in mapping and mapping['linkedin_url'] < len(row) else ''
            city = row[mapping['city']].strip() if 'city' in mapping and mapping['city'] < len(row) else default_city
            state = row[mapping['state']].strip() if 'state' in mapping and mapping['state'] < len(row) else default_state

            if not email and not linkedin:
                print(f"  Skipping {full_name} — no email or LinkedIn")
                skipped += 1
                continue

            # Find or create the building/company
            building_id = None
            if company:
                building = insert_building({
                    'name': company,
                    'company': company,
                    'city': city,
                    'state': state,
                    'source': 'csv_import',
                    'status': 'enriched',
                })
                building_id = building.get('id')

            # Insert contact
            try:
                contact_data = {
                    'full_name': full_name,
                    'email': email or None,
                    'title': title or None,
                    'linkedin_url': linkedin or None,
                    'source': 'csv_import',
                    'status': 'new',
                }
                if building_id:
                    contact_data['building_id'] = building_id

                insert_contact(contact_data)
                imported += 1
                print(f"  ✓ {full_name} — {title} @ {company} ({email})")
            except Exception as e:
                print(f"  ✗ {full_name}: {e}")
                skipped += 1

        print(f"\n{'='*50}")
        print(f"Imported: {imported}")
        print(f"Skipped:  {skipped}")
        print(f"{'='*50}")
        return imported


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Import contacts from CSV')
    parser.add_argument('csv_file', help='Path to CSV file')
    parser.add_argument('--city', default='New York', help='Default city if not in CSV')
    parser.add_argument('--state', default='NY', help='Default state if not in CSV')
    args = parser.parse_args()
    run(args.csv_file, args.city, args.state)
