#!/usr/bin/env python3
"""
Auto Follow-up Daemon
=====================
Runs on a schedule (via cron/launchd) to automatically:
  1. Check for contacts due for follow-up (4 days, 7 days after last email)
  2. Generate follow-up drafts
  3. Send them (respecting warm-up limits)

Usage:
    python auto_followup.py              # Run once (for cron)
    python auto_followup.py --daemon     # Run continuously (checks every 6 hours)
    python auto_followup.py --dry-run    # Preview without sending
"""

import sys
import os
import time
import logging
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.config import RESEND_API_KEY
from agents.followup_manager import run as check_followups
from agents.email_sender import run as send_emails

# Set up logging
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, 'auto_followup.log')),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)

CHECK_INTERVAL_HOURS = 6


def run_cycle(dry_run: bool = False):
    """Run one follow-up check + send cycle."""
    log.info("=" * 50)
    log.info("Auto follow-up cycle starting")
    log.info(f"Time: {datetime.now(timezone.utc).isoformat()}")
    log.info("=" * 50)

    # Step 1: Generate follow-up drafts for contacts who are due
    log.info("\nStep 1: Checking for contacts needing follow-up...")
    try:
        drafts_created = check_followups(dry_run=dry_run)
        log.info(f"Follow-up drafts created: {drafts_created}")
    except Exception as e:
        log.error(f"Error checking follow-ups: {e}")
        drafts_created = 0

    # Step 2: Send any queued/draft follow-ups
    if drafts_created > 0 and not dry_run:
        log.info("\nStep 2: Sending follow-up emails...")
        try:
            sent = send_emails(auto_queue=True, dry_run=dry_run)
            log.info(f"Follow-up emails sent: {sent}")
        except Exception as e:
            log.error(f"Error sending follow-ups: {e}")
    elif dry_run:
        log.info("\nStep 2: [DRY RUN] Skipping send")
    else:
        log.info("\nStep 2: No new follow-ups to send")

    log.info("\nCycle complete.\n")


def run_daemon(dry_run: bool = False):
    """Run continuously, checking every CHECK_INTERVAL_HOURS."""
    log.info(f"Starting auto follow-up daemon (checking every {CHECK_INTERVAL_HOURS} hours)")
    log.info("Press Ctrl+C to stop\n")

    while True:
        try:
            run_cycle(dry_run=dry_run)
        except Exception as e:
            log.error(f"Cycle error: {e}")

        next_check = datetime.now(timezone.utc).isoformat()
        log.info(f"Next check in {CHECK_INTERVAL_HOURS} hours...")
        time.sleep(CHECK_INTERVAL_HOURS * 3600)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Auto Follow-up Daemon')
    parser.add_argument('--daemon', action='store_true', help='Run continuously')
    parser.add_argument('--dry-run', action='store_true', help='Preview without sending')
    args = parser.parse_args()

    if args.daemon:
        run_daemon(dry_run=args.dry_run)
    else:
        run_cycle(dry_run=args.dry_run)
