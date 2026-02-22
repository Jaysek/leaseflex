import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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

const EXTRACTION_PROMPT = `You are extracting key lease terms from a lease agreement document. Analyze the document and return a JSON object with these fields:

- monthly_rent: number (the monthly rent amount, e.g. 2300)
- address: string (the rental property street address, e.g. "339 East 9th Street, Apt. 4B")
- city: string (the city, e.g. "New York")
- state: string (two-letter state abbreviation, e.g. "NY")
- lease_start_date: string (ISO format YYYY-MM-DD, e.g. "2025-12-01")
- lease_end_date: string (ISO format YYYY-MM-DD, e.g. "2026-11-30")
- early_termination_fee_amount: number or null (the early termination fee if mentioned)
- sublet_allowed: "yes", "no", or "unknown" (whether subletting is permitted)

Rules:
- For renewal leases, use the NEW renewal dates and rent amounts, not the expiring ones.
- If a field is not found or unclear, omit it from the JSON.
- For rent, use the final/new monthly rent amount (after any increases).
- Return ONLY valid JSON, no markdown, no explanation.`;

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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'Lease parsing service not configured. Please fill in the form manually.' },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from extraction model');
    }

    // Parse the JSON response, stripping any markdown fencing
    const jsonStr = textBlock.text.replace(/```json\n?|\n?```/g, '').trim();
    const extracted = JSON.parse(jsonStr) as Record<string, unknown>;

    // Map and validate into ParsedLease
    const parsed: ParsedLease = {};

    if (typeof extracted.monthly_rent === 'number' && extracted.monthly_rent >= 500 && extracted.monthly_rent <= 50000) {
      parsed.monthly_rent = extracted.monthly_rent;
    }
    if (typeof extracted.address === 'string' && extracted.address.length > 0) {
      parsed.address = extracted.address;
    }
    if (typeof extracted.city === 'string' && extracted.city.length > 0) {
      parsed.city = extracted.city;
    }
    if (typeof extracted.state === 'string' && /^[A-Z]{2}$/.test(extracted.state)) {
      parsed.state = extracted.state;
    }
    if (typeof extracted.lease_start_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(extracted.lease_start_date)) {
      parsed.lease_start_date = extracted.lease_start_date;
    }
    if (typeof extracted.lease_end_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(extracted.lease_end_date)) {
      parsed.lease_end_date = extracted.lease_end_date;
    }
    if (typeof extracted.early_termination_fee_amount === 'number' && extracted.early_termination_fee_amount > 0) {
      parsed.early_termination_fee_amount = extracted.early_termination_fee_amount;
    }
    if (extracted.sublet_allowed === 'yes' || extracted.sublet_allowed === 'no') {
      parsed.sublet_allowed = extracted.sublet_allowed;
    }

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
