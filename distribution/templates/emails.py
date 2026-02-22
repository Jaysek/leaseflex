"""
Email templates for the outreach sequence.
These are base templates — Agent 3 personalizes them with AI.
"""

SEQUENCE = [
    {
        'id': 'intro',
        'sequence_number': 1,
        'subject': 'Lease conversion tool for {building_name}',
        'body': """Hi {first_name},

I'm building a renter mobility product that lets tenants break their lease without penalty.

The reason property managers are interested:

It increases lease conversion by giving renters confidence to commit.

Buildings that offer LeaseFlex see:

• Faster lease decisions — renters stop hesitating
• Fewer negotiation requests — tenants accept standard terms
• Longer lease terms — renters choose 12 months instead of 6

It costs the building nothing. Renters pay a small monthly fee.

Would you be open to a quick call to see how it works?

Justin
Founder, LeaseFlex""",
        'delay_days': 0,
    },
    {
        'id': 'follow_up_1',
        'sequence_number': 2,
        'subject': 'Re: Lease conversion tool for {building_name}',
        'body': """Hi {first_name},

Following up on my note last week. Wanted to share a quick stat:

The average lease break costs a tenant $5,000–$15,000. That fear is why renters hesitate to sign — or choose month-to-month.

LeaseFlex removes that fear. Buildings that offer it as an amenity see measurably faster leasing velocity.

Happy to walk you through it in 10 minutes if you're curious.

Justin""",
        'delay_days': 4,
    },
    {
        'id': 'follow_up_2',
        'sequence_number': 3,
        'subject': 'Quick question about {building_name}',
        'body': """Hi {first_name},

Last note from me — just curious:

Do your tenants ever hesitate to sign because they're worried about job changes, relocations, or life events locking them into a lease?

If that comes up, LeaseFlex is a zero-cost amenity that solves it. Tenants pay a small monthly fee and get covered if they need to break their lease.

Happy to chat if it's relevant. If not, no worries at all.

Justin""",
        'delay_days': 7,
    },
]


def get_template(sequence_number: int) -> dict:
    """Get the email template for a given sequence number."""
    for template in SEQUENCE:
        if template['sequence_number'] == sequence_number:
            return template
    return None


def fill_template(template: dict, variables: dict) -> dict:
    """Fill in template variables."""
    return {
        'subject': template['subject'].format(**variables),
        'body': template['body'].format(**variables),
        'sequence_number': template['sequence_number'],
    }
