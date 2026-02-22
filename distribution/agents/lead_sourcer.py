"""
Agent 1 — Lead Sourcer
Finds multifamily buildings via Google search + Apartments.com scraping.
Stores them in the buildings table.
"""

import httpx
from bs4 import BeautifulSoup
import re
import time
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import insert_building, get_buildings
from utils.config import TARGET_CITIES

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}


def scrape_apartments_com(city: str, state: str, max_pages: int = 3) -> list:
    """Scrape Apartments.com for multifamily buildings in a city."""
    buildings = []
    city_slug = city.lower().replace(' ', '-')
    state_slug = state.lower().replace(' ', '-')

    for page in range(1, max_pages + 1):
        url = f"https://www.apartments.com/{city_slug}-{state_slug}/{page}/"
        print(f"  Scraping: {url}")

        try:
            resp = httpx.get(url, headers=HEADERS, timeout=15, follow_redirects=True)
            if resp.status_code != 200:
                print(f"  Got status {resp.status_code}, skipping page")
                continue

            soup = BeautifulSoup(resp.text, 'html.parser')
            listings = soup.select('li.mortar-wrapper article.placard')

            if not listings:
                # Try alternate selector
                listings = soup.select('article[data-listingid]')

            if not listings:
                print(f"  No listings found on page {page}, stopping")
                break

            for listing in listings:
                try:
                    title_el = listing.select_one('.property-title') or listing.select_one('span.js-placardTitle')
                    address_el = listing.select_one('.property-address') or listing.select_one('div.property-address')
                    units_el = listing.select_one('.property-pricing') or listing.select_one('.bed-range')

                    name = title_el.get_text(strip=True) if title_el else None
                    address = address_el.get_text(strip=True) if address_el else None

                    # Try to extract unit count from listing text
                    unit_count = None
                    full_text = listing.get_text()
                    unit_match = re.search(r'(\d+)\s*(?:units?|apartments?|homes?)', full_text, re.IGNORECASE)
                    if unit_match:
                        unit_count = int(unit_match.group(1))

                    property_url = None
                    link_el = listing.select_one('a.property-link') or listing.find('a', href=True)
                    if link_el and link_el.get('href'):
                        href = link_el['href']
                        if href.startswith('http'):
                            property_url = href
                        elif href.startswith('/'):
                            property_url = f"https://www.apartments.com{href}"

                    if name:
                        buildings.append({
                            'name': name,
                            'address': address,
                            'city': city,
                            'state': state,
                            'unit_count': unit_count,
                            'property_url': property_url,
                            'source': 'apartments_com',
                            'status': 'new',
                        })
                except Exception as e:
                    print(f"  Error parsing listing: {e}")
                    continue

            print(f"  Found {len(listings)} listings on page {page}")
            time.sleep(2)  # Be respectful

        except Exception as e:
            print(f"  Error scraping page {page}: {e}")
            continue

    return buildings


def scrape_google_maps(city: str, state: str) -> list:
    """Search Google for property management companies in a city."""
    buildings = []
    query = f"property management company {city} {state} multifamily"
    url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

    try:
        resp = httpx.get(url, headers=HEADERS, timeout=15, follow_redirects=True)
        soup = BeautifulSoup(resp.text, 'html.parser')

        # Extract company names from search results
        for result in soup.select('div.g'):
            title_el = result.select_one('h3')
            link_el = result.select_one('a')
            snippet_el = result.select_one('div.VwiC3b')

            if title_el:
                name = title_el.get_text(strip=True)
                # Filter out irrelevant results
                if any(skip in name.lower() for skip in ['yelp', 'indeed', 'glassdoor', 'wikipedia']):
                    continue

                property_url = link_el['href'] if link_el and link_el.get('href') else None
                company = name.split(' - ')[0].split(' | ')[0].strip()

                buildings.append({
                    'name': company,
                    'company': company,
                    'city': city,
                    'state': state,
                    'property_url': property_url,
                    'source': 'google',
                    'status': 'new',
                })
    except Exception as e:
        print(f"  Error searching Google: {e}")

    return buildings


# Mapping of city names to state abbreviations
CITY_STATES = {
    'New York': 'NY', 'Los Angeles': 'CA', 'Chicago': 'IL',
    'Miami': 'FL', 'Austin': 'TX', 'San Francisco': 'CA',
    'Seattle': 'WA', 'Denver': 'CO', 'Boston': 'MA',
    'Atlanta': 'GA', 'Dallas': 'TX', 'Houston': 'TX',
    'Phoenix': 'AZ', 'Philadelphia': 'PA', 'Washington': 'DC',
    'Nashville': 'TN', 'Charlotte': 'NC', 'Portland': 'OR',
    'Minneapolis': 'MN', 'San Diego': 'CA',
}


def run(cities: list = None, max_pages: int = 3):
    """Run the lead sourcer for given cities."""
    cities = cities or TARGET_CITIES
    total_added = 0

    for city in cities:
        state = CITY_STATES.get(city, '')
        if not state:
            print(f"Unknown city: {city}, skipping (add to CITY_STATES)")
            continue

        print(f"\n{'='*50}")
        print(f"Sourcing leads in {city}, {state}")
        print(f"{'='*50}")

        # Source 1: Apartments.com
        print(f"\n[Apartments.com]")
        apt_buildings = scrape_apartments_com(city, state, max_pages)
        print(f"  Found {len(apt_buildings)} buildings")

        # Source 2: Google search for property management companies
        print(f"\n[Google Search]")
        google_buildings = scrape_google_maps(city, state)
        print(f"  Found {len(google_buildings)} companies")

        # Save to database
        all_buildings = apt_buildings + google_buildings
        added = 0
        for building in all_buildings:
            try:
                result = insert_building(building)
                if result:
                    added += 1
            except Exception as e:
                print(f"  Error saving {building.get('name')}: {e}")

        print(f"\nSaved {added} new leads for {city}")
        total_added += added

    print(f"\n{'='*50}")
    print(f"Total new leads added: {total_added}")
    print(f"{'='*50}")
    return total_added


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Lead Sourcer — find multifamily buildings')
    parser.add_argument('--cities', nargs='+', help='Cities to search')
    parser.add_argument('--pages', type=int, default=3, help='Max pages per city on Apartments.com')
    args = parser.parse_args()
    run(cities=args.cities, max_pages=args.pages)
