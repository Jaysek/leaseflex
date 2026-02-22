"""
Agent 3 — Outreach Writer
Takes contacts + building data and generates personalized cold emails
using Claude API. Stores drafts in outreach_emails table.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from anthropic import Anthropic
from utils.db import get_contacts, insert_outreach_email, get_outreach_emails
from utils.config import ANTHROPIC_API_KEY
from templates.emails import SEQUENCE, get_template

client = None

def get_client():
    global client
    if client is None:
        if not ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY must be set in .env")
        client = Anthropic(api_key=ANTHROPIC_API_KEY)
    return client


SYSTEM_PROMPT = """You are a cold email personalizer for LeaseFlex, a renter mobility product.

Your job: take a base email template and personalize it for a specific property manager / building.

Rules:
- Keep the email SHORT (under 120 words)
- Never sound like a sales robot
- Sound like a founder sending a genuine note
- Reference something specific about their building or company if possible
- Keep the core value prop intact: LeaseFlex increases lease conversion by giving renters confidence to commit
- The building pays nothing — renters pay a small monthly fee
- Sign off as Justin
- Do NOT add subject line — just return the email body
- Do NOT use excessive formatting, bullet points are fine but sparingly
- Match the casual, direct tone of the template
"""


def personalize_email(template_body: str, contact: dict, building: dict) -> str:
    """Use Claude to personalize an email template."""
    ai = get_client()

    context_parts = []
    if building.get('name'):
        context_parts.append(f"Building: {building['name']}")
    if building.get('company'):
        context_parts.append(f"Company: {building['company']}")
    if building.get('city'):
        context_parts.append(f"City: {building['city']}, {building.get('state', '')}")
    if building.get('unit_count'):
        context_parts.append(f"Units: {building['unit_count']}")
    if contact.get('full_name') and contact['full_name'] != 'Unknown':
        context_parts.append(f"Contact: {contact['full_name']}")
    if contact.get('title'):
        context_parts.append(f"Title: {contact['title']}")

    context = '\n'.join(context_parts)

    response = ai.messages.create(
        model='claude-haiku-4-5-20251001',
        max_tokens=500,
        system=SYSTEM_PROMPT,
        messages=[{
            'role': 'user',
            'content': f"""Personalize this email template for the contact below.

TEMPLATE:
{template_body}

CONTEXT:
{context}

Return only the personalized email body, nothing else."""
        }]
    )

    return response.content[0].text


def run(limit: int = 50, sequence_number: int = 1, use_ai: bool = True):
    """Generate outreach emails for contacts that haven't been emailed yet."""
    # Get contacts with status 'new' (never emailed)
    contacts = get_contacts(status='new', limit=limit)

    if not contacts:
        print("No new contacts to write emails for. Run contact_enricher first.")
        return 0

    template = get_template(sequence_number)
    if not template:
        print(f"No template for sequence number {sequence_number}")
        return 0

    print(f"Writing sequence #{sequence_number} emails for {len(contacts)} contacts...")
    if use_ai:
        print("Using AI personalization (Claude Haiku)\n")
    else:
        print("Using template fill (no AI)\n")

    written = 0

    for contact in contacts:
        building = contact.get('buildings') or {}
        name = contact.get('full_name', 'Unknown')
        email = contact.get('email')

        if not email:
            print(f"  Skipping {name} — no email")
            continue

        # Check if we already have an email for this contact at this sequence
        existing = get_outreach_emails(contact_id=contact['id'])
        if any(e.get('sequence_number') == sequence_number for e in existing):
            print(f"  Skipping {name} — already has sequence #{sequence_number}")
            continue

        first_name = name.split()[0] if name != 'Unknown' else 'there'
        building_name = building.get('name', 'your building')

        variables = {
            'first_name': first_name,
            'building_name': building_name,
        }

        if use_ai:
            try:
                body = personalize_email(template['body'], contact, building)
            except Exception as e:
                print(f"  AI error for {name}, falling back to template: {e}")
                body = template['body'].format(**variables)
        else:
            body = template['body'].format(**variables)

        subject = template['subject'].format(**variables)

        # Save as draft
        try:
            insert_outreach_email({
                'contact_id': contact['id'],
                'building_id': building.get('id'),
                'sequence_number': sequence_number,
                'subject': subject,
                'body': body,
                'status': 'draft',
            })
            written += 1
            print(f"  ✓ Draft for {name} ({email})")
        except Exception as e:
            print(f"  Error saving draft for {name}: {e}")

    print(f"\n{'='*50}")
    print(f"Wrote {written} email drafts")
    print(f"{'='*50}")
    return written


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Outreach Writer — generate personalized emails')
    parser.add_argument('--limit', type=int, default=50, help='Max contacts to write for')
    parser.add_argument('--sequence', type=int, default=1, help='Sequence number (1=intro, 2=follow-up, 3=final)')
    parser.add_argument('--no-ai', action='store_true', help='Skip AI personalization, use templates only')
    args = parser.parse_args()
    run(limit=args.limit, sequence_number=args.sequence, use_ai=not args.no_ai)
