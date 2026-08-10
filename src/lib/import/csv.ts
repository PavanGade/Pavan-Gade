export type CsvCell = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvCell>;

export type ImportTargetField =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "linkedinUrl"
  | "title"
  | "companyName"
  | "companyDomain"
  | "industry"
  | "location"
  | "source";

export type ColumnMapping = Partial<Record<ImportTargetField, string>>;

export interface ExistingProspectRecord {
  id?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface ImportProspectData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  title?: string;
  companyName?: string;
  companyDomain?: string;
  industry?: string;
  location?: string;
  source?: string;
}

export type EvaluatedImportRowStatus = "valid" | "invalid" | "duplicate";

export interface EvaluatedImportRow {
  rowNumber: number;
  raw: CsvRow;
  data: ImportProspectData;
  status: EvaluatedImportRowStatus;
  errors: string[];
  warnings: string[];
  duplicateKey?: string;
  duplicateOf?: string;
}

export interface ImportEvaluationResult {
  rows: EvaluatedImportRow[];
  summary: ImportSummary;
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  warningRows: number;
}

const FIELD_ALIASES: Record<ImportTargetField, string[]> = {
  firstName: ["first name", "firstname", "given name", "given_name"],
  lastName: ["last name", "lastname", "surname", "family name", "family_name"],
  fullName: ["name", "full name", "fullname", "contact name", "person"],
  email: ["email", "email address", "work email", "business email", "e-mail"],
  phone: ["phone", "phone number", "mobile", "mobile phone", "telephone", "cell"],
  linkedinUrl: ["linkedin", "linkedin url", "linkedin profile", "linkedin_url", "profile url"],
  title: ["title", "job title", "role", "position"],
  companyName: ["company", "company name", "account", "organization", "organisation"],
  companyDomain: ["domain", "company domain", "website", "company website"],
  industry: ["industry", "sector", "vertical"],
  location: ["location", "city", "region", "country", "address"],
  source: ["source", "lead source", "origin"],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const normalizedHeaders = headers.map((header) => ({
    original: header,
    normalized: normalizeHeader(header),
  }));

  return (Object.keys(FIELD_ALIASES) as ImportTargetField[]).reduce<ColumnMapping>((mapping, field) => {
    const aliases = FIELD_ALIASES[field].map(normalizeHeader);
    const match = normalizedHeaders.find(({ normalized }) => aliases.includes(normalized));

    if (match) {
      return { ...mapping, [field]: match.original };
    }

    const fuzzyMatch = normalizedHeaders.find(({ normalized }) =>
      aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized)),
    );

    return fuzzyMatch ? { ...mapping, [field]: fuzzyMatch.original } : mapping;
  }, {});
}

export function evaluateImportRows(
  rows: CsvRow[],
  mapping: ColumnMapping,
  existingProspects: ExistingProspectRecord[] = [],
): ImportEvaluationResult {
  const seen = new Map<string, string>();

  existingProspects.forEach((prospect) => {
    buildDedupeKeys(prospect).forEach((key) => {
      seen.set(key, prospect.id ?? "existing prospect");
    });
  });

  const evaluatedRows = rows.map<EvaluatedImportRow>((row, index) => {
    const rowNumber = index + 1;
    const data = mapRow(row, mapping);
    const validation = validateMappedRow(data);
    const keys = buildDedupeKeys(data);
    const duplicateKey = keys.find((key) => seen.has(key));
    const duplicateOf = duplicateKey ? seen.get(duplicateKey) : undefined;

    if (duplicateKey === undefined) {
      keys.forEach((key) => {
        seen.set(key, `row ${rowNumber}`);
      });
    }

    const status: EvaluatedImportRowStatus =
      validation.errors.length > 0 ? "invalid" : duplicateKey ? "duplicate" : "valid";

    return {
      rowNumber,
      raw: row,
      data,
      status,
      errors: validation.errors,
      warnings: validation.warnings,
      duplicateKey,
      duplicateOf,
    };
  });

  return {
    rows: evaluatedRows,
    summary: summarizeImport(evaluatedRows),
  };
}

export function summarizeImport(rows: EvaluatedImportRow[]): ImportSummary {
  return rows.reduce<ImportSummary>(
    (summary, row) => ({
      totalRows: summary.totalRows + 1,
      validRows: summary.validRows + (row.status === "valid" ? 1 : 0),
      invalidRows: summary.invalidRows + (row.status === "invalid" ? 1 : 0),
      duplicateRows: summary.duplicateRows + (row.status === "duplicate" ? 1 : 0),
      warningRows: summary.warningRows + (row.warnings.length > 0 ? 1 : 0),
    }),
    {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicateRows: 0,
      warningRows: 0,
    },
  );
}

function mapRow(row: CsvRow, mapping: ColumnMapping): ImportProspectData {
  const mapped: ImportProspectData = {};

  (Object.keys(mapping) as ImportTargetField[]).forEach((field) => {
    const header = mapping[field];

    if (!header) {
      return;
    }

    const value = toCleanString(row[header]);

    if (value) {
      mapped[field] = value;
    }
  });

  if (!mapped.firstName && !mapped.lastName && mapped.fullName) {
    const parts = mapped.fullName.split(/\s+/).filter(Boolean);
    mapped.firstName = parts[0];
    mapped.lastName = parts.slice(1).join(" ") || undefined;
  }

  mapped.email = normalizeEmail(mapped.email);
  mapped.phone = normalizePhone(mapped.phone);
  mapped.linkedinUrl = normalizeLinkedinUrl(mapped.linkedinUrl);
  mapped.companyDomain = normalizeDomain(mapped.companyDomain);

  return mapped;
}

function validateMappedRow(data: ImportProspectData): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const hasName = Boolean(data.fullName || data.firstName || data.lastName);
  const hasContactMethod = Boolean(data.email || data.phone || data.linkedinUrl);
  const hasCompany = Boolean(data.companyName || data.companyDomain);

  if (!hasContactMethod && !(hasName && hasCompany)) {
    errors.push("Provide email, phone, LinkedIn URL, or name plus company.");
  }

  if (data.email && !EMAIL_PATTERN.test(data.email)) {
    errors.push("Email address is invalid.");
  }

  if (data.phone && data.phone.replace(/\D/g, "").length < 7) {
    errors.push("Phone number is too short.");
  }

  if (!data.companyName && !data.companyDomain) {
    warnings.push("Company is missing.");
  }

  if (!data.title) {
    warnings.push("Job title is missing.");
  }

  return { errors, warnings };
}

function buildDedupeKeys(record: ExistingProspectRecord | ImportProspectData): string[] {
  const keys: string[] = [];
  const email = normalizeEmail(record.email);
  const phone = normalizePhone(record.phone);
  const linkedinUrl = normalizeLinkedinUrl(record.linkedinUrl);
  const name = normalizeDedupePart(
    "fullName" in record && record.fullName
      ? record.fullName
      : [record.firstName, record.lastName].filter(Boolean).join(" "),
  );
  const company = normalizeDedupePart(
    "companyName" in record ? record.companyName : record.companyName,
  );

  if (email) {
    keys.push(`email:${email}`);
  }

  if (phone) {
    keys.push(`phone:${phone}`);
  }

  if (linkedinUrl) {
    keys.push(`linkedin:${linkedinUrl}`);
  }

  if (name && company) {
    keys.push(`name-company:${name}:${company}`);
  }

  return keys;
}

function toCleanString(value: CsvCell): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const cleaned = String(value).trim();

  return cleaned.length > 0 ? cleaned : undefined;
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function normalizeEmail(value: string | undefined): string | undefined {
  return value?.trim().toLowerCase() || undefined;
}

function normalizePhone(value: string | undefined): string | undefined {
  const digits = value?.replace(/\D/g, "");

  return digits && digits.length > 0 ? digits : undefined;
}

function normalizeLinkedinUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");

  return trimmed || undefined;
}

function normalizeDomain(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const withoutProtocol = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  const domain = withoutProtocol.split("/")[0];

  return domain || undefined;
}

function normalizeDedupePart(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, " ");

  return normalized && normalized.length > 0 ? normalized : undefined;
}
