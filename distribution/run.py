#!/usr/bin/env python3
"""
LeaseFlex Distribution Engine
==============================

AI-powered outbound system for landlord acquisition.

Usage:
    python run.py pipeline          # Run full pipeline: source → enrich → write → send
    python run.py source            # Find new buildings
    python run.py enrich            # Find contacts at buildings
    python run.py write             # Generate personalized emails
    python run.py send              # Send queued emails
    python run.py followup          # Generate follow-up emails
    python run.py status            # Show pipeline stats
    python run.py send --dry-run    # Preview without sending
    python run.py classify           # Classify a reply (interactive)
"""

import sys
import os
import argparse

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def cmd_import(args):
    from agents.csv_importer import run
    run(args.csv_file, args.city, args.state)


def cmd_seed(args):
    from agents.seed_targets import run
    run()


def cmd_source(args):
    from agents.lead_sourcer import run
    cities = args.cities if args.cities else None
    run(cities=cities, max_pages=args.pages)


def cmd_enrich(args):
    from agents.contact_enricher import run
    run(limit=args.limit)


def cmd_write(args):
    from agents.outreach_writer import run
    run(limit=args.limit, sequence_number=args.sequence, use_ai=not args.no_ai)


def cmd_send(args):
    from agents.email_sender import run
    run(auto_queue=args.auto_queue, dry_run=args.dry_run)


def cmd_followup(args):
    from agents.followup_manager import run
    run(dry_run=args.dry_run)


def cmd_classify(args):
    from agents.reply_classifier import classify_from_text, run_interactive
    if args.email and args.reply:
        classify_from_text(args.email, args.reply)
    else:
        run_interactive()


def cmd_pipeline(args):
    """Run the full pipeline end-to-end."""
    print("=" * 60)
    print("  LeaseFlex Distribution Pipeline")
    print("=" * 60)

    # Step 1: Source leads
    print("\n\n🔍 STEP 1: Sourcing leads...")
    print("-" * 40)
    from agents.lead_sourcer import run as source
    cities = args.cities if args.cities else None
    source(cities=cities, max_pages=args.pages)

    # Step 2: Enrich contacts
    print("\n\n👤 STEP 2: Enriching contacts...")
    print("-" * 40)
    from agents.contact_enricher import run as enrich
    enrich(limit=args.limit)

    # Step 3: Write emails
    print("\n\n✍️  STEP 3: Writing personalized emails...")
    print("-" * 40)
    from agents.outreach_writer import run as write
    write(limit=args.limit, use_ai=not args.no_ai)

    # Step 4: Check for follow-ups
    print("\n\n🔄 STEP 4: Checking follow-ups...")
    print("-" * 40)
    from agents.followup_manager import run as followup
    followup(dry_run=args.dry_run)

    # Step 5: Send (only if not dry run)
    if not args.dry_run:
        print("\n\n📨 STEP 5: Sending emails...")
        print("-" * 40)
        from agents.email_sender import run as send
        send(auto_queue=True)
    else:
        print("\n\n📨 STEP 5: Skipped sending (dry run mode)")

    print("\n" + "=" * 60)
    print("  Pipeline complete!")
    print("=" * 60)


def cmd_status(args):
    """Show pipeline statistics."""
    from utils.db import get_db
    db = get_db()

    print("=" * 50)
    print("  LeaseFlex Distribution — Pipeline Status")
    print("=" * 50)

    # Buildings
    buildings = db.table('buildings').select('status', count='exact').execute()
    b_total = buildings.count or 0

    b_statuses = {}
    for status in ['new', 'enriched', 'contacted', 'replied', 'meeting', 'onboarded', 'rejected']:
        result = db.table('buildings').select('id', count='exact').eq('status', status).execute()
        count = result.count or 0
        if count > 0:
            b_statuses[status] = count

    print(f"\nBuildings: {b_total}")
    for status, count in b_statuses.items():
        print(f"  {status}: {count}")

    # Contacts
    contacts = db.table('contacts').select('id', count='exact').execute()
    c_total = contacts.count or 0

    c_statuses = {}
    for status in ['new', 'emailed', 'replied', 'meeting', 'closed', 'unsubscribed']:
        result = db.table('contacts').select('id', count='exact').eq('status', status).execute()
        count = result.count or 0
        if count > 0:
            c_statuses[status] = count

    print(f"\nContacts: {c_total}")
    for status, count in c_statuses.items():
        print(f"  {status}: {count}")

    # Emails
    emails = db.table('outreach_emails').select('id', count='exact').execute()
    e_total = emails.count or 0

    e_statuses = {}
    for status in ['draft', 'queued', 'sent', 'opened', 'replied', 'bounced']:
        result = db.table('outreach_emails').select('id', count='exact').eq('status', status).execute()
        count = result.count or 0
        if count > 0:
            e_statuses[status] = count

    print(f"\nEmails: {e_total}")
    for status, count in e_statuses.items():
        print(f"  {status}: {count}")

    # Conversion funnel
    if b_total > 0:
        print(f"\nConversion funnel:")
        print(f"  Buildings → Enriched: {b_statuses.get('enriched', 0)}/{b_total} ({b_statuses.get('enriched', 0)*100//max(b_total,1)}%)")
        print(f"  Contacted → Replied:  {c_statuses.get('replied', 0)}/{c_statuses.get('emailed', 0) or 0}")
        print(f"  Replied → Meeting:    {c_statuses.get('meeting', 0)}/{c_statuses.get('replied', 0) or 0}")

    print()


def main():
    parser = argparse.ArgumentParser(
        description='LeaseFlex Distribution Engine',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run.py pipeline --dry-run              # Test full pipeline without sending
  python run.py source --cities "New York" "Miami"  # Source leads in specific cities
  python run.py write --no-ai                   # Use templates without AI personalization
  python run.py send --dry-run                  # Preview what would be sent
  python run.py status                          # Check pipeline stats
        """
    )

    subparsers = parser.add_subparsers(dest='command', required=True)

    # Source
    p_source = subparsers.add_parser('source', help='Find new buildings')
    p_source.add_argument('--cities', nargs='+', help='Cities to search')
    p_source.add_argument('--pages', type=int, default=3, help='Max pages per city')
    p_source.set_defaults(func=cmd_source)

    # Enrich
    p_enrich = subparsers.add_parser('enrich', help='Find contacts at buildings')
    p_enrich.add_argument('--limit', type=int, default=50, help='Max buildings to process')
    p_enrich.set_defaults(func=cmd_enrich)

    # Write
    p_write = subparsers.add_parser('write', help='Generate personalized emails')
    p_write.add_argument('--limit', type=int, default=50, help='Max contacts')
    p_write.add_argument('--sequence', type=int, default=1, help='Sequence number')
    p_write.add_argument('--no-ai', action='store_true', help='Skip AI personalization')
    p_write.set_defaults(func=cmd_write)

    # Send
    p_send = subparsers.add_parser('send', help='Send queued emails')
    p_send.add_argument('--auto-queue', action='store_true', help='Auto-queue drafts')
    p_send.add_argument('--dry-run', action='store_true', help='Preview without sending')
    p_send.set_defaults(func=cmd_send)

    # Follow-up
    p_followup = subparsers.add_parser('followup', help='Generate follow-up emails')
    p_followup.add_argument('--dry-run', action='store_true', help='Preview only')
    p_followup.set_defaults(func=cmd_followup)

    # Pipeline
    p_pipeline = subparsers.add_parser('pipeline', help='Run full pipeline')
    p_pipeline.add_argument('--cities', nargs='+', help='Cities to search')
    p_pipeline.add_argument('--pages', type=int, default=3, help='Max pages per city')
    p_pipeline.add_argument('--limit', type=int, default=50, help='Max items per step')
    p_pipeline.add_argument('--no-ai', action='store_true', help='Skip AI personalization')
    p_pipeline.add_argument('--dry-run', action='store_true', help='Preview without sending')
    p_pipeline.set_defaults(func=cmd_pipeline)

    # Import CSV
    p_import = subparsers.add_parser('import', help='Import contacts from CSV (Apollo, LinkedIn export)')
    p_import.add_argument('csv_file', help='Path to CSV file')
    p_import.add_argument('--city', default='New York', help='Default city')
    p_import.add_argument('--state', default='NY', help='Default state')
    p_import.set_defaults(func=cmd_import)

    # Seed
    p_seed = subparsers.add_parser('seed', help='Seed database with target companies')
    p_seed.set_defaults(func=cmd_seed)

    # Classify reply
    p_classify = subparsers.add_parser('classify', help='Classify an incoming reply')
    p_classify.add_argument('--email', help='Contact email address')
    p_classify.add_argument('--reply', help='Reply text')
    p_classify.set_defaults(func=cmd_classify)

    # Status
    p_status = subparsers.add_parser('status', help='Show pipeline statistics')
    p_status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()
