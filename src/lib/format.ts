/**
 * Shared formatting helpers for dates and reading-time strings.
 *
 * Consolidates the ad-hoc `Intl.DateTimeFormat` calls scattered across the
 * routes so the archive renders dates consistently no matter where they
 * appear (cards, listings, longform meta panels, calendar exports).
 */

const DATE_FORMATS = {
  short: { year: "numeric", month: "short", day: "2-digit" },
  long: { year: "numeric", month: "long", day: "2-digit" },
  monthYear: { year: "numeric", month: "long" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateFormatVariant = keyof typeof DATE_FORMATS;

const FORMATTERS = {
  short: new Intl.DateTimeFormat("en", DATE_FORMATS.short),
  long: new Intl.DateTimeFormat("en", DATE_FORMATS.long),
  monthYear: new Intl.DateTimeFormat("en", DATE_FORMATS.monthYear),
} as const;

const toDate = (value?: string | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (
  value?: string | Date | null,
  variant: DateFormatVariant = "short",
) => {
  const parsed = toDate(value);
  if (!parsed) return undefined;
  return FORMATTERS[variant].format(parsed);
};

/**
 * Render `reading-time`'s freeform string ("3 min read") in a tighter
 * casing for our archive layout ("3 min read"). Pure pass-through for now,
 * but centralized so future tweaks (icons, suffix, etc.) only happen here.
 */
export const formatReadingTime = (value?: string) => value?.trim();
