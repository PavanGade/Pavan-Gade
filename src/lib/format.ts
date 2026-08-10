export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    ...options,
  }).format(amount);
}

export function initials(name: string, fallback = "?"): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return fallback;
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? fallback;
  }

  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase() || fallback;
}

export function formatRelativeDate(value: Date | string | number, now: Date = new Date()): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const diffMs = date.getTime() - now.getTime();
  const absoluteSeconds = Math.round(Math.abs(diffMs) / 1000);
  const suffix = diffMs < 0 ? "ago" : "from now";

  if (absoluteSeconds < 45) {
    return "just now";
  }

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  const match = units.find(([, seconds]) => absoluteSeconds >= seconds);

  if (!match) {
    return `${absoluteSeconds} seconds ${suffix}`;
  }

  const [unit, seconds] = match;
  const valueInUnit = Math.round(absoluteSeconds / seconds);

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    diffMs < 0 ? -valueInUnit : valueInUnit,
    unit,
  );
}

export function normalizePhone(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const hasPlus = value.trim().startsWith("+");
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return undefined;
  }

  return `${hasPlus ? "+" : ""}${digits}`;
}

export function normalizeEmail(value: string | null | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();

  return normalized && normalized.length > 0 ? normalized : undefined;
}
