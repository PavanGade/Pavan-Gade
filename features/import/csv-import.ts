import { z } from 'zod';

export const PROSPECT_IMPORT_FIELDS = [
  'full_name',
  'first_name',
  'last_name',
  'email',
  'phone',
  'job_title',
  'company',
  'industry',
  'location',
  'city',
  'state',
  'country',
  'seniority',
  'department',
  'linkedin_url',
  'source',
] as const;

export type ProspectImportField = (typeof PROSPECT_IMPORT_FIELDS)[number];

export type ColumnMapping = Partial<Record<ProspectImportField, string>>;

const emailSchema = z.string().email();
const phoneSchema = z.string().min(7).max(32);

export type NormalizedImportRow = {
  full_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  company?: string;
  industry?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  seniority?: string;
  department?: string;
  linkedin_url?: string;
  source?: string;
};

export type ImportRowEvaluation = {
  rowNumber: number;
  raw: Record<string, string>;
  normalized: NormalizedImportRow | null;
  status: 'VALID' | 'DUPLICATE' | 'INVALID';
  errorMessage?: string;
  duplicateOf?: 'email' | 'phone' | 'name_company';
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pick(raw: Record<string, string>, mapping: ColumnMapping, field: ProspectImportField) {
  const col = mapping[field];
  if (!col) return undefined;
  const value = raw[col];
  if (value == null || String(value).trim() === '') return undefined;
  return String(value).trim();
}

export function mapCsvRow(
  raw: Record<string, string>,
  mapping: ColumnMapping,
): { normalized: NormalizedImportRow | null; error?: string } {
  const first = pick(raw, mapping, 'first_name');
  const last = pick(raw, mapping, 'last_name');
  let fullName = pick(raw, mapping, 'full_name');
  if (!fullName && (first || last)) {
    fullName = [first, last].filter(Boolean).join(' ');
  }
  if (!fullName) {
    return { normalized: null, error: 'Name is required' };
  }

  const email = pick(raw, mapping, 'email');
  if (email && !emailSchema.safeParse(email).success) {
    return { normalized: null, error: 'Invalid email' };
  }

  const phone = pick(raw, mapping, 'phone');
  if (phone && !phoneSchema.safeParse(phone).success) {
    return { normalized: null, error: 'Invalid phone' };
  }

  return {
    normalized: {
      full_name: fullName,
      first_name: first,
      last_name: last,
      email: email?.toLowerCase(),
      phone,
      job_title: pick(raw, mapping, 'job_title'),
      company: pick(raw, mapping, 'company'),
      industry: pick(raw, mapping, 'industry'),
      location: pick(raw, mapping, 'location'),
      city: pick(raw, mapping, 'city'),
      state: pick(raw, mapping, 'state'),
      country: pick(raw, mapping, 'country'),
      seniority: pick(raw, mapping, 'seniority'),
      department: pick(raw, mapping, 'department'),
      linkedin_url: pick(raw, mapping, 'linkedin_url'),
      source: pick(raw, mapping, 'source') ?? 'csv_import',
    },
  };
}

export type ExistingProspectKey = {
  email?: string | null;
  phone?: string | null;
  full_name: string;
  company_name?: string | null;
};

export function evaluateImportRows(
  rows: Record<string, string>[],
  mapping: ColumnMapping,
  existing: ExistingProspectKey[],
): ImportRowEvaluation[] {
  const seenEmails = new Set(
    existing.map((e) => e.email?.toLowerCase()).filter((v): v is string => Boolean(v)),
  );
  const seenPhones = new Set(
    existing.map((e) => e.phone).filter((v): v is string => Boolean(v)),
  );
  const seenNameCompany = new Set(
    existing.map((e) => `${normalizeKey(e.full_name)}|${normalizeKey(e.company_name ?? '')}`),
  );

  const batchEmails = new Set<string>();
  const batchPhones = new Set<string>();
  const batchNameCompany = new Set<string>();

  return rows.map((raw, index) => {
    const rowNumber = index + 1;
    const mapped = mapCsvRow(raw, mapping);
    if (!mapped.normalized) {
      return {
        rowNumber,
        raw,
        normalized: null,
        status: 'INVALID' as const,
        errorMessage: mapped.error,
      };
    }

    const n = mapped.normalized;
    if (n.email && (seenEmails.has(n.email) || batchEmails.has(n.email))) {
      return {
        rowNumber,
        raw,
        normalized: n,
        status: 'DUPLICATE' as const,
        duplicateOf: 'email',
        errorMessage: 'Duplicate email',
      };
    }
    if (n.phone && (seenPhones.has(n.phone) || batchPhones.has(n.phone))) {
      return {
        rowNumber,
        raw,
        normalized: n,
        status: 'DUPLICATE' as const,
        duplicateOf: 'phone',
        errorMessage: 'Duplicate phone',
      };
    }
    const nameCompany = `${normalizeKey(n.full_name)}|${normalizeKey(n.company ?? '')}`;
    if (seenNameCompany.has(nameCompany) || batchNameCompany.has(nameCompany)) {
      return {
        rowNumber,
        raw,
        normalized: n,
        status: 'DUPLICATE' as const,
        duplicateOf: 'name_company',
        errorMessage: 'Duplicate name + company',
      };
    }

    if (n.email) batchEmails.add(n.email);
    if (n.phone) batchPhones.add(n.phone);
    batchNameCompany.add(nameCompany);

    return { rowNumber, raw, normalized: n, status: 'VALID' as const };
  });
}

/** Heuristic auto-map CSV headers → PRSPCT fields. */
export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const rules: { field: ProspectImportField; patterns: RegExp[] }[] = [
    { field: 'full_name', patterns: [/^full.?name$/i, /^name$/i, /^contact$/i] },
    { field: 'first_name', patterns: [/^first.?name$/i, /^fname$/i] },
    { field: 'last_name', patterns: [/^last.?name$/i, /^lname$/i, /^surname$/i] },
    { field: 'email', patterns: [/^e-?mail/i, /^email.?address$/i] },
    { field: 'phone', patterns: [/^phone$/i, /^mobile$/i, /^cell$/i] },
    { field: 'job_title', patterns: [/^title$/i, /^job.?title$/i, /^position$/i] },
    { field: 'company', patterns: [/^company$/i, /^organization$/i, /^account$/i] },
    { field: 'industry', patterns: [/^industry$/i] },
    { field: 'location', patterns: [/^location$/i, /^address$/i] },
    { field: 'city', patterns: [/^city$/i] },
    { field: 'state', patterns: [/^state$/i, /^region$/i] },
    { field: 'country', patterns: [/^country$/i] },
    { field: 'seniority', patterns: [/^seniority$/i] },
    { field: 'department', patterns: [/^department$/i, /^dept$/i] },
    { field: 'linkedin_url', patterns: [/linkedin/i] },
    { field: 'source', patterns: [/^source$/i] },
  ];

  for (const header of headers) {
    for (const rule of rules) {
      if (mapping[rule.field]) continue;
      if (rule.patterns.some((p) => p.test(header.trim()))) {
        mapping[rule.field] = header;
      }
    }
  }
  return mapping;
}

export function summarizeImport(rows: ImportRowEvaluation[]) {
  return {
    total: rows.length,
    valid: rows.filter((r) => r.status === 'VALID').length,
    duplicates: rows.filter((r) => r.status === 'DUPLICATE').length,
    invalid: rows.filter((r) => r.status === 'INVALID').length,
  };
}
