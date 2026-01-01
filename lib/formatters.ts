/**
 * Locale-Aware Formatters for ZchuyotBuddy
 *
 * Provides formatting utilities for dates, numbers, currency, and more
 * with proper Hebrew and English locale support.
 */

type Locale = "he" | "en";
type DateFormat = "short" | "medium" | "long" | "relative";

/**
 * Get the Intl locale string for a given locale
 */
function getIntlLocale(locale: Locale): string {
  return locale === "he" ? "he-IL" : "en-US";
}

/**
 * Format a date according to locale and format type
 *
 * @param date - Date to format (Date object or string)
 * @param locale - Target locale ('he' or 'en')
 * @param format - Format type ('short', 'medium', 'long', 'relative')
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'he', 'medium') // "1 בינו׳ 2024"
 * formatDate(new Date(), 'en', 'long') // "Monday, January 1, 2024"
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  format: DateFormat = "medium"
): string {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  if (format === "relative") {
    return formatRelativeTime(d, locale);
  }

  const options: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    short: { day: "numeric", month: "numeric" },
    medium: { day: "numeric", month: "short", year: "numeric" },
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
    relative: {}, // Handled above
  };

  return new Intl.DateTimeFormat(getIntlLocale(locale), options[format]).format(d);
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to format
 * @param locale - Target locale
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000), 'he') // "לפני שעה"
 * formatRelativeTime(new Date(Date.now() + 86400000), 'en') // "in 1 day"
 */
export function formatRelativeTime(date: Date, locale: Locale): string {
  const rtf = new Intl.RelativeTimeFormat(getIntlLocale(locale), {
    numeric: "auto",
  });

  const diffMs = date.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
  const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
  const diffYears = Math.round(diffMs / (1000 * 60 * 60 * 24 * 365));

  // Find the most appropriate unit
  if (Math.abs(diffSeconds) < 60) {
    return rtf.format(diffSeconds, "second");
  }
  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, "minute");
  }
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, "day");
  }
  if (Math.abs(diffWeeks) < 4) {
    return rtf.format(diffWeeks, "week");
  }
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, "month");
  }
  return rtf.format(diffYears, "year");
}

/**
 * Format a number according to locale
 *
 * @param num - Number to format
 * @param locale - Target locale
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567.89, 'he') // "1,234,567.89"
 * formatNumber(1234567.89, 'en') // "1,234,567.89"
 */
export function formatNumber(
  num: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), options).format(num);
}

/**
 * Format a number as compact (e.g., 1.2K, 3.5M)
 *
 * @param num - Number to format
 * @param locale - Target locale
 * @returns Compact number string
 *
 * @example
 * formatCompactNumber(1500, 'he') // "1.5K" or "1.5 אלף"
 * formatCompactNumber(2500000, 'en') // "2.5M"
 */
export function formatCompactNumber(num: number, locale: Locale): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

/**
 * Format currency in Israeli Shekels (ILS)
 *
 * @param amount - Amount to format
 * @param locale - Target locale
 * @returns Formatted currency string with ₪ symbol
 *
 * @example
 * formatCurrency(49, 'he') // "₪49"
 * formatCurrency(49.99, 'en') // "₪49.99"
 */
export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency with always showing decimals
 *
 * @param amount - Amount to format
 * @param locale - Target locale
 * @returns Formatted currency string with decimals
 *
 * @example
 * formatCurrencyPrecise(49, 'he') // "₪49.00"
 */
export function formatCurrencyPrecise(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as percentage
 *
 * @param value - Value to format (0-100 scale, will be divided by 100)
 * @param locale - Target locale
 * @returns Formatted percentage string
 *
 * @example
 * formatPercent(75, 'he') // "75%"
 * formatPercent(33.5, 'en') // "33.5%"
 */
export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

/**
 * Format a decimal as percentage (value is already 0-1)
 *
 * @param value - Decimal value (0-1 scale)
 * @param locale - Target locale
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentDecimal(0.75, 'he') // "75%"
 */
export function formatPercentDecimal(value: number, locale: Locale): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format an Israeli phone number
 *
 * @param phone - Phone number string (any format)
 * @returns Formatted phone number (05X-XXX-XXXX)
 *
 * @example
 * formatPhoneNumber('0501234567') // "050-123-4567"
 * formatPhoneNumber('+972501234567') // "050-123-4567"
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");

  // Remove country code if present
  if (cleaned.startsWith("972")) {
    cleaned = "0" + cleaned.slice(3);
  }

  // Format as 05X-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Format as 0X-XXX-XXXX (landline)
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }

  // Return original if can't format
  return phone;
}

/**
 * Format an Israeli ID number (Teudat Zehut)
 *
 * @param id - ID number string
 * @returns Formatted ID with dashes
 *
 * @example
 * formatIsraeliId('123456789') // "12-345-6789"
 */
export function formatIsraeliId(id: string): string {
  const cleaned = id.replace(/\D/g, "").padStart(9, "0");

  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }

  return id;
}

/**
 * Format file size in human-readable format
 *
 * @param bytes - Size in bytes
 * @param locale - Target locale
 * @returns Formatted size string
 *
 * @example
 * formatFileSize(1024, 'en') // "1 KB"
 * formatFileSize(1048576, 'he') // "1 MB"
 */
export function formatFileSize(bytes: number, locale: Locale): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, locale, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
}

/**
 * Format a duration in milliseconds to human-readable string
 *
 * @param ms - Duration in milliseconds
 * @param locale - Target locale
 * @returns Formatted duration string
 *
 * @example
 * formatDuration(3661000, 'en') // "1h 1m"
 * formatDuration(90000, 'he') // "1 דק' 30 שנ'"
 */
export function formatDuration(ms: number, locale: Locale): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    if (locale === "he") {
      return remainingHours > 0 ? `${days} ימים ${remainingHours} שעות` : `${days} ימים`;
    }
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (locale === "he") {
      return remainingMinutes > 0 ? `${hours} שעות ${remainingMinutes} דק'` : `${hours} שעות`;
    }
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    if (locale === "he") {
      return remainingSeconds > 0 ? `${minutes} דק' ${remainingSeconds} שנ'` : `${minutes} דק'`;
    }
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  return locale === "he" ? `${seconds} שניות` : `${seconds}s`;
}

/**
 * Format a list of items with proper locale-aware conjunction
 *
 * @param items - Array of strings to join
 * @param locale - Target locale
 * @param type - List type ('conjunction', 'disjunction', 'unit')
 * @returns Formatted list string
 *
 * @example
 * formatList(['א', 'ב', 'ג'], 'he') // "א, ב וג"
 * formatList(['a', 'b', 'c'], 'en') // "a, b, and c"
 */
export function formatList(
  items: string[],
  locale: Locale,
  type: "conjunction" | "disjunction" | "unit" = "conjunction"
): string {
  return new Intl.ListFormat(getIntlLocale(locale), {
    style: "long",
    type,
  }).format(items);
}

/**
 * Format ordinal number (1st, 2nd, 3rd, etc.)
 *
 * @param num - Number to format as ordinal
 * @param locale - Target locale
 * @returns Ordinal string
 *
 * @example
 * formatOrdinal(1, 'en') // "1st"
 * formatOrdinal(2, 'he') // "2"
 */
export function formatOrdinal(num: number, locale: Locale): string {
  // Hebrew doesn't typically use ordinal suffixes
  if (locale === "he") {
    return num.toString();
  }

  const pr = new Intl.PluralRules("en-US", { type: "ordinal" });
  const suffixes: Record<string, string> = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };

  return `${num}${suffixes[pr.select(num)]}`;
}

