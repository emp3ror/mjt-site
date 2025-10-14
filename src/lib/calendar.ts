import type { EventDateShape } from "@/lib/events";
import { normalizeEventDates } from "@/lib/events";

const padNumber = (value: number) => value.toString().padStart(2, "0");

const formatDatePart = (date: Date) =>
  `${date.getFullYear()}${padNumber(date.getMonth() + 1)}${padNumber(date.getDate())}`;

const formatDateTimePart = (date: Date) =>
  `${formatDatePart(date)}T${padNumber(date.getHours())}${padNumber(date.getMinutes())}${padNumber(date.getSeconds())}`;

const escapeText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

type CalendarInput = EventDateShape & {
  title: string;
  description?: string;
  location?: string;
  url?: string;
};

export const buildIcsContent = ({
  title,
  description,
  location,
  url,
  ...dateFields
}: CalendarInput) => {
  const { start, endCalendar, isAllDay } = normalizeEventDates(dateFields);
  const dtStamp = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MJT Studio//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTAMP:${formatDateTimePart(dtStamp)}`,
    isAllDay
      ? `DTSTART;VALUE=DATE:${formatDatePart(start)}`
      : `DTSTART:${formatDateTimePart(start)}`,
    isAllDay
      ? `DTEND;VALUE=DATE:${formatDatePart(endCalendar)}`
      : `DTEND:${formatDateTimePart(endCalendar)}`,
    `SUMMARY:${escapeText(title)}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${escapeText(description)}`);
  }

  if (location) {
    lines.push(`LOCATION:${escapeText(location)}`);
  }

  if (url) {
    lines.push(`URL:${escapeText(url)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
};

export const buildIcsDataUri = (input: CalendarInput) => {
  const content = buildIcsContent(input);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
};

export const buildGoogleCalendarLink = ({
  title,
  description,
  location,
  url,
  ...dateFields
}: CalendarInput) => {
  const { start, endCalendar, isAllDay } = normalizeEventDates(dateFields);

  const dates = isAllDay
    ? `${formatDatePart(start)}/${formatDatePart(endCalendar)}`
    : `${formatDateTimePart(start)}/${formatDateTimePart(endCalendar)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates,
  });

  const detailParts = [];

  if (description) {
    detailParts.push(description);
  }

  if (url) {
    detailParts.push(url);
  }

  if (detailParts.length > 0) {
    params.set("details", detailParts.join("\n\n"));
  }

  if (location) {
    params.set("location", location);
  }

  return `https://www.google.com/calendar/render?${params.toString()}`;
};
