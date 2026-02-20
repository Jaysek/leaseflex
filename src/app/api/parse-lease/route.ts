import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

interface ParsedLease {
  monthly_rent?: number;
  address?: string;
  city?: string;
  state?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  early_termination_fee_amount?: number;
  sublet_allowed?: 'yes' | 'no' | 'unknown';
}

function extractRent(text: string): number | undefined {
  // Match patterns like "$3,000/month", "$3000 per month", "monthly rent: $3,000", "rent of $3,000"
  const patterns = [
    /(?:monthly\s*rent|rent\s*(?:is|of|:))\s*\$?([\d,]+(?:\.\d{2})?)/i,
    /\$\s*([\d,]+(?:\.\d{2})?)\s*(?:\/\s*month|per\s*month|monthly|\/\s*mo)/i,
    /(?:rent|payment)\s*(?:of|:)\s*\$?([\d,]+(?:\.\d{2})?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const val = parseFloat(match[1].replace(/,/g, ''));
      if (val >= 500 && val <= 50000) return val;
    }
  }
  return undefined;
}

function extractDates(text: string): { start?: string; end?: string } {
  // Match patterns like "01/01/2025", "January 1, 2025", "2025-01-01"
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{4})/g,
    /(\d{4}-\d{2}-\d{2})/g,
    /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})/gi,
  ];

  const dates: Date[] = [];
  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const d = new Date(match[1]);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 2020 && d.getFullYear() <= 2035) {
        dates.push(d);
      }
    }
  }

  // Also check for "commencing" / "beginning" / "start" and "ending" / "expiring" / "terminating" context
  const startContext = /(?:commenc|begin|start|effective)\w*\s*(?:on|date|:)?\s*/i;
  const endContext = /(?:end|expir|terminat|conclud)\w*\s*(?:on|date|:)?\s*/i;

  let start: string | undefined;
  let end: string | undefined;

  // Try context-aware extraction
  for (const pattern of datePatterns) {
    const startMatch = new RegExp(startContext.source + pattern.source.replace(/^\/|\/\w*$/g, ''), 'i').exec(text);
    if (startMatch) {
      const d = new Date(startMatch[1]);
      if (!isNaN(d.getTime())) start = d.toISOString().split('T')[0];
    }
    const endMatch = new RegExp(endContext.source + pattern.source.replace(/^\/|\/\w*$/g, ''), 'i').exec(text);
    if (endMatch) {
      const d = new Date(endMatch[1]);
      if (!isNaN(d.getTime())) end = d.toISOString().split('T')[0];
    }
  }

  // Fallback: if we found at least 2 dates, assume earliest is start, latest is end
  if (!start && !end && dates.length >= 2) {
    dates.sort((a, b) => a.getTime() - b.getTime());
    start = dates[0].toISOString().split('T')[0];
    end = dates[dates.length - 1].toISOString().split('T')[0];
  }

  return { start, end };
}

function extractTerminationFee(text: string): number | undefined {
  const patterns = [
    /(?:early\s*termination|break|cancellation)\s*(?:fee|penalty|charge)\s*(?:of|:|\s)\s*\$?([\d,]+)/i,
    /\$\s*([\d,]+)\s*(?:early\s*termination|break|cancellation)\s*(?:fee|penalty)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const val = parseFloat(match[1].replace(/,/g, ''));
      if (val > 0 && val < 100000) return val;
    }
  }
  return undefined;
}

function extractSublet(text: string): 'yes' | 'no' | 'unknown' {
  const noSublet = /(?:no|not|prohibit|forbid|shall not|may not)\s*(?:sublet|subleas|assign)/i;
  const yesSublet = /(?:may|can|permit|allow|right to)\s*(?:sublet|subleas|assign)/i;
  if (noSublet.test(text)) return 'no';
  if (yesSublet.test(text)) return 'yes';
  return 'unknown';
}

function extractAddress(text: string): string | undefined {
  // Match street address patterns like "123 Main St", "456 Oak Avenue, Apt 2B"
  const patterns = [
    /(?:premises|property|located at|address[:\s]*)\s*(\d+[^,\n]{5,60})/i,
    /(\d+\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\s+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Ln|Lane|Way|Ct|Court|Pl|Place|Cir|Circle)\.?(?:\s*,?\s*(?:Apt|Suite|Unit|#)\s*\w+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return undefined;
}

function extractCityState(text: string): { city?: string; state?: string } {
  const stateAbbrevs = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
  ];
  // Match "City, ST" or "City, State ZIP"
  const pattern = new RegExp(`([A-Z][a-zA-Z\\s]+),\\s*(${stateAbbrevs.join('|')})\\b`, 'g');
  const match = pattern.exec(text);
  if (match) {
    return { city: match[1].trim(), state: match[2] };
  }
  return {};
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text;

    const parsed: ParsedLease = {};
    parsed.monthly_rent = extractRent(text);
    parsed.address = extractAddress(text);

    const dates = extractDates(text);
    parsed.lease_start_date = dates.start;
    parsed.lease_end_date = dates.end;

    parsed.early_termination_fee_amount = extractTerminationFee(text);
    parsed.sublet_allowed = extractSublet(text);

    const location = extractCityState(text);
    parsed.city = location.city;
    parsed.state = location.state;

    const fieldsFound = Object.values(parsed).filter((v) => v !== undefined).length;

    return NextResponse.json({
      parsed,
      fields_found: fieldsFound,
      total_fields: 7,
      message: fieldsFound > 0
        ? `Found ${fieldsFound} field${fieldsFound > 1 ? 's' : ''} from your lease. Review and fill in the rest.`
        : 'Could not extract details automatically. Please fill in the form manually.',
    });
  } catch (err) {
    console.error('Parse lease error:', err);
    return NextResponse.json(
      { error: 'Failed to parse lease. Please fill in the form manually.' },
      { status: 500 }
    );
  }
}
