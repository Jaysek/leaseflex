'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Upload, FileText, Check, Sparkles, Scan, Shield, Clock, Zap } from 'lucide-react';
import { US_STATES } from '@/lib/constants';
import { track } from '@/lib/analytics';
import type { SubletAllowed } from '@/lib/types';

const SCAN_PHRASES = [
  'Reading lease document...',
  'Scanning for rent clauses...',
  'Checking termination penalties...',
  'Analyzing sublet terms...',
  'Extracting lease dates...',
  'Calculating your flexibility...',
];

export default function OfferForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [scanPhrase, setScanPhrase] = useState(0);
  const [parseMessage, setParseMessage] = useState('');
  const [parseSuccess, setParseSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cycle through scan phrases while parsing
  useEffect(() => {
    if (!parsing) return;
    const interval = setInterval(() => {
      setScanPhrase((prev) => (prev + 1) % SCAN_PHRASES.length);
    }, 800);
    return () => clearInterval(interval);
  }, [parsing]);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    job_title: '',
    monthly_rent: '',
    address: '',
    city: '',
    state: '',
    lease_start_date: '',
    lease_end_date: '',
    early_termination_fee_known: false,
    early_termination_fee_amount: '',
    sublet_allowed: 'unknown' as SubletAllowed,
  });

  // Check for pre-parsed lease data (from hero upload button)
  useEffect(() => {
    const stored = sessionStorage.getItem('leaseflex_parsed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setForm((prev) => ({
          ...prev,
          full_name: parsed.tenant_name || prev.full_name,
          monthly_rent: parsed.monthly_rent?.toString() || prev.monthly_rent,
          address: parsed.address || prev.address,
          city: parsed.city || prev.city,
          state: parsed.state || prev.state,
          lease_start_date: parsed.lease_start_date || prev.lease_start_date,
          lease_end_date: parsed.lease_end_date || prev.lease_end_date,
          early_termination_fee_known: parsed.early_termination_fee_amount != null ? true : prev.early_termination_fee_known,
          early_termination_fee_amount: parsed.early_termination_fee_amount?.toString() || prev.early_termination_fee_amount,
          sublet_allowed: parsed.sublet_allowed !== 'unknown' ? parsed.sublet_allowed : prev.sublet_allowed,
        }));
        const fieldsFound = Object.values(parsed).filter((v: unknown) => v !== undefined && v !== 'unknown').length;
        if (fieldsFound > 0) {
          setParseMessage(`Auto-filled ${fieldsFound} field${fieldsFound > 1 ? 's' : ''} from your lease. Review and complete the rest.`);
          setFileName('Uploaded lease');
        }
      } catch {
        // ignore
      }
      sessionStorage.removeItem('leaseflex_parsed');
    }
  }, []);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFileUpload = async (file: File) => {
    track('offer_form_upload_lease');
    setParsing(true);
    setParseMessage('');
    setParseSuccess(false);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/parse-lease', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setParseSuccess(false);
        setParseMessage('No worries — just fill in the details below.');
        setParsing(false);
        return;
      }

      const parsed = data.parsed;
      setForm((prev) => ({
        ...prev,
        full_name: parsed.tenant_name || prev.full_name,
        monthly_rent: parsed.monthly_rent?.toString() || prev.monthly_rent,
        address: parsed.address || prev.address,
        city: parsed.city || prev.city,
        state: parsed.state || prev.state,
        lease_start_date: parsed.lease_start_date || prev.lease_start_date,
        lease_end_date: parsed.lease_end_date || prev.lease_end_date,
        early_termination_fee_known: parsed.early_termination_fee_amount != null ? true : prev.early_termination_fee_known,
        early_termination_fee_amount: parsed.early_termination_fee_amount?.toString() || prev.early_termination_fee_amount,
        sublet_allowed: parsed.sublet_allowed !== 'unknown' ? parsed.sublet_allowed : prev.sublet_allowed,
      }));

      setParseSuccess(true);
      setParseMessage(data.message);
    } catch {
      setParseSuccess(false);
      setParseMessage('No worries — just fill in the details below.');
    }
    setParsing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    } else {
      setParseMessage('Please upload a PDF file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    track('offer_form_submit', { monthly_rent: Number(form.monthly_rent), state: form.state });
    setLoading(true);
    setErrors({});

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      job_title: form.job_title.trim(),
      monthly_rent: Number(form.monthly_rent),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state,
      lease_start_date: form.lease_start_date,
      lease_end_date: form.lease_end_date,
      early_termination_fee_known: form.early_termination_fee_known,
      early_termination_fee_amount: form.early_termination_fee_amount
        ? Number(form.early_termination_fee_amount)
        : undefined,
      sublet_allowed: form.sublet_allowed,
    };

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const err of data.errors) {
            fieldErrors[err.field] = err.message;
          }
          setErrors(fieldErrors);
        }
        setLoading(false);
        return;
      }

      sessionStorage.setItem('leaseflex_offer', JSON.stringify(data));
      router.push(`/quote/${data.id}`);
    } catch {
      setErrors({ _form: 'Something went wrong. Please try again.' });
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-all';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <div className="space-y-8">
      {/* Lease Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all ${
          fileName && parseSuccess
            ? 'border-emerald-200 bg-emerald-50/50'
            : fileName
            ? 'border-neutral-200 bg-neutral-50/50'
            : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50'
        } p-6 text-center`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />

        {parsing ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <Scan className="w-8 h-8 text-neutral-900 animate-pulse" />
            <p className="text-sm font-medium text-neutral-700 transition-all duration-300">
              {SCAN_PHRASES[scanPhrase]}
            </p>
            <div className="w-48 h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-neutral-900 rounded-full animate-[scan_2s_ease-in-out_infinite]"
                style={{ animation: 'scan 2s ease-in-out infinite' }} />
            </div>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-2 w-full overflow-hidden px-2">
            <div className="flex items-center gap-2 max-w-full">
              <FileText className={`w-5 h-5 shrink-0 ${parseSuccess ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span className={`text-sm font-medium truncate ${parseSuccess ? 'text-emerald-700' : 'text-neutral-600'}`}>{fileName}</span>
              {parseSuccess && <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
            </div>
            {parseMessage && (
              <div className="flex items-center gap-1.5 mt-1">
                {parseSuccess ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ) : null}
                <p className="text-xs text-neutral-500">{parseMessage}</p>
              </div>
            )}
            <p className="text-xs text-neutral-400 mt-1">
              Click to upload a different file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-neutral-300" />
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Upload your lease to auto-fill
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Drop a PDF here or click to browse &middot; Optional
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Divider with "or" */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-neutral-100" />
        <span className="text-xs text-neutral-400">or fill in manually</span>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors._form && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {errors._form}
          </div>
        )}

        {/* Section: About You */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            About you
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full name *</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Job title</label>
              <input
                type="text"
                placeholder="Software Engineer"
                value={form.job_title}
                onChange={(e) => update('job_title', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              placeholder="jane@email.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
              required
            />
            <p className="text-[11px] text-neutral-400 mt-1">We&apos;ll send your offer here</p>
          </div>
        </div>

        {/* Section: Your Lease */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Your lease
          </p>

          <div>
            <label className={labelClass}>Monthly rent *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
              <input
                type="number"
                placeholder="3,000"
                value={form.monthly_rent}
                onChange={(e) => update('monthly_rent', e.target.value)}
                className={`${inputClass} pl-8`}
                required
                min={500}
                max={50000}
              />
            </div>
            {errors.monthly_rent && <p className={errorClass}>{errors.monthly_rent}</p>}
          </div>

          <div>
            <label className={labelClass}>Rental address *</label>
            <input
              type="text"
              placeholder="123 Main St, Apt 4B"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className={inputClass}
              required
            />
            {errors.address && <p className={errorClass}>{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City *</label>
              <input
                type="text"
                placeholder="New York"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className={inputClass}
                required
              />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass}>State *</label>
              <select
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && <p className={errorClass}>{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Lease start *</label>
              <input
                type="date"
                value={form.lease_start_date}
                onChange={(e) => update('lease_start_date', e.target.value)}
                className={inputClass}
                required
              />
              {errors.lease_start_date && <p className={errorClass}>{errors.lease_start_date}</p>}
            </div>
            <div>
              <label className={labelClass}>Lease end *</label>
              <input
                type="date"
                value={form.lease_end_date}
                onChange={(e) => update('lease_end_date', e.target.value)}
                className={inputClass}
                required
              />
              {errors.lease_end_date && <p className={errorClass}>{errors.lease_end_date}</p>}
            </div>
          </div>
        </div>

        {/* Section: Optional */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Optional — helps us give a better quote
          </p>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.early_termination_fee_known}
                onChange={(e) => update('early_termination_fee_known', e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-700">I know my early termination fee</span>
            </label>
            {form.early_termination_fee_known && (
              <div className="mt-3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.early_termination_fee_amount}
                  onChange={(e) => update('early_termination_fee_amount', e.target.value)}
                  className={`${inputClass} pl-8`}
                  min={0}
                />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Subletting allowed?</label>
            <div className="flex gap-3">
              {(['yes', 'no', 'unknown'] as SubletAllowed[]).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => update('sublet_allowed', val)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.sublet_allowed === val
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {val === 'unknown' ? "I don't know" : val.charAt(0).toUpperCase() + val.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full group inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-neutral-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating your offer...
              </>
            ) : (
              <>
                See my personalized offer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* Inline trust signals */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Instant results
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              No credit check
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Cancel anytime
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
