"""
Seed the database with known target companies from the distribution playbook.
These are the companies you'll manually prospect first.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import insert_building, insert_contact

# Top property management companies — mix of institutional and mid-size
TARGETS = [
    # Institutional (large operators)
    {'name': 'Greystar', 'company': 'Greystar Real Estate Partners', 'city': 'New York', 'state': 'NY', 'unit_count': 5000, 'property_url': 'https://www.greystar.com', 'source': 'manual'},
    {'name': 'Greystar', 'company': 'Greystar Real Estate Partners', 'city': 'Los Angeles', 'state': 'CA', 'unit_count': 3000, 'property_url': 'https://www.greystar.com', 'source': 'manual'},
    {'name': 'Greystar', 'company': 'Greystar Real Estate Partners', 'city': 'Miami', 'state': 'FL', 'unit_count': 2500, 'property_url': 'https://www.greystar.com', 'source': 'manual'},
    {'name': 'AvalonBay Communities', 'company': 'AvalonBay', 'city': 'New York', 'state': 'NY', 'unit_count': 4000, 'property_url': 'https://www.avaloncommunities.com', 'source': 'manual'},
    {'name': 'AvalonBay Communities', 'company': 'AvalonBay', 'city': 'Los Angeles', 'state': 'CA', 'unit_count': 2000, 'property_url': 'https://www.avaloncommunities.com', 'source': 'manual'},
    {'name': 'Equity Residential', 'company': 'Equity Residential', 'city': 'New York', 'state': 'NY', 'unit_count': 3500, 'property_url': 'https://www.equityapartments.com', 'source': 'manual'},
    {'name': 'Equity Residential', 'company': 'Equity Residential', 'city': 'Chicago', 'state': 'IL', 'unit_count': 2000, 'property_url': 'https://www.equityapartments.com', 'source': 'manual'},
    {'name': 'Bozzuto', 'company': 'Bozzuto Group', 'city': 'New York', 'state': 'NY', 'unit_count': 2000, 'property_url': 'https://www.bozzuto.com', 'source': 'manual'},
    {'name': 'Bozzuto', 'company': 'Bozzuto Group', 'city': 'Miami', 'state': 'FL', 'unit_count': 1500, 'property_url': 'https://www.bozzuto.com', 'source': 'manual'},
    {'name': 'Related Companies', 'company': 'Related Companies', 'city': 'New York', 'state': 'NY', 'unit_count': 5000, 'property_url': 'https://www.related.com', 'source': 'manual'},

    # NYC-focused mid-size operators
    {'name': 'Stonehenge NYC', 'company': 'Stonehenge Partners', 'city': 'New York', 'state': 'NY', 'unit_count': 800, 'property_url': 'https://www.stonehengenyc.com', 'source': 'manual'},
    {'name': 'Rose Associates', 'company': 'Rose Associates', 'city': 'New York', 'state': 'NY', 'unit_count': 1200, 'property_url': 'https://www.roseassociates.com', 'source': 'manual'},
    {'name': 'L+M Development Partners', 'company': 'L+M Development', 'city': 'New York', 'state': 'NY', 'unit_count': 2000, 'property_url': 'https://www.lmdevpartners.com', 'source': 'manual'},
    {'name': 'Brookfield Properties', 'company': 'Brookfield', 'city': 'New York', 'state': 'NY', 'unit_count': 3000, 'property_url': 'https://www.brookfieldproperties.com', 'source': 'manual'},
    {'name': 'Silverstein Properties', 'company': 'Silverstein Properties', 'city': 'New York', 'state': 'NY', 'unit_count': 1000, 'property_url': 'https://www.silversteinproperties.com', 'source': 'manual'},
    {'name': 'TF Cornerstone', 'company': 'TF Cornerstone', 'city': 'New York', 'state': 'NY', 'unit_count': 1500, 'property_url': 'https://www.tfcornerstone.com', 'source': 'manual'},
    {'name': 'Gotham Organization', 'company': 'Gotham Organization', 'city': 'New York', 'state': 'NY', 'unit_count': 800, 'property_url': 'https://www.gothamorg.com', 'source': 'manual'},

    # Miami-focused
    {'name': 'Related Group', 'company': 'Related Group', 'city': 'Miami', 'state': 'FL', 'unit_count': 2000, 'property_url': 'https://www.relatedgroup.com', 'source': 'manual'},
    {'name': 'ZOM Living', 'company': 'ZOM Living', 'city': 'Miami', 'state': 'FL', 'unit_count': 1000, 'property_url': 'https://www.zomliving.com', 'source': 'manual'},

    # LA-focused
    {'name': 'Essex Property Trust', 'company': 'Essex Property Trust', 'city': 'Los Angeles', 'state': 'CA', 'unit_count': 2500, 'property_url': 'https://www.essexapartmenthomes.com', 'source': 'manual'},
    {'name': 'Decron Properties', 'company': 'Decron Properties', 'city': 'Los Angeles', 'state': 'CA', 'unit_count': 800, 'property_url': 'https://www.decron.com', 'source': 'manual'},

    # Chicago-focused
    {'name': 'Related Midwest', 'company': 'Related Midwest', 'city': 'Chicago', 'state': 'IL', 'unit_count': 1500, 'property_url': 'https://www.relatedmidwest.com', 'source': 'manual'},
    {'name': 'Magellan Development', 'company': 'Magellan Development', 'city': 'Chicago', 'state': 'IL', 'unit_count': 1000, 'property_url': 'https://www.magellandevelopment.com', 'source': 'manual'},

    # Austin-focused
    {'name': 'Oden Hughes', 'company': 'Oden Hughes', 'city': 'Austin', 'state': 'TX', 'unit_count': 600, 'property_url': 'https://www.odenhughes.com', 'source': 'manual'},
    {'name': 'Presidium', 'company': 'Presidium Group', 'city': 'Austin', 'state': 'TX', 'unit_count': 800, 'property_url': 'https://www.presidiumgroup.com', 'source': 'manual'},

    # National mid-size
    {'name': 'Camden Property Trust', 'company': 'Camden Property Trust', 'city': 'Austin', 'state': 'TX', 'unit_count': 1500, 'property_url': 'https://www.camdenliving.com', 'source': 'manual'},
    {'name': 'UDR', 'company': 'UDR Inc', 'city': 'New York', 'state': 'NY', 'unit_count': 1000, 'property_url': 'https://www.udr.com', 'source': 'manual'},
    {'name': 'MAA', 'company': 'Mid-America Apartment Communities', 'city': 'Miami', 'state': 'FL', 'unit_count': 1200, 'property_url': 'https://www.maac.com', 'source': 'manual'},
    {'name': 'Cortland', 'company': 'Cortland', 'city': 'Atlanta', 'state': 'GA', 'unit_count': 2000, 'property_url': 'https://www.cortland.com', 'source': 'manual'},
]


def run():
    """Seed the database with target companies."""
    print(f"Seeding {len(TARGETS)} target buildings...\n")
    added = 0

    for target in TARGETS:
        try:
            result = insert_building({**target, 'status': 'new'})
            if result:
                added += 1
                print(f"  ✓ {target['name']} — {target['city']}, {target['state']}")
        except Exception as e:
            print(f"  ✗ {target['name']}: {e}")

    print(f"\n{'='*50}")
    print(f"Seeded {added} buildings")
    print(f"{'='*50}")
    return added


if __name__ == '__main__':
    run()
