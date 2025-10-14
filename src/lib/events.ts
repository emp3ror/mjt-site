const normalizeTime = (time?: string) => {
  if (!time) {
    return "00:00:00";
  }

  if (/^\d{2}$/.test(time)) {
    return `${time}:00:00`;
  }

  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${time}:00`;
  }

  return time;
};

const extractDatePart = (value?: string) => {
  if (!value) {
    return "";
  }

  return value.includes("T") ? value.split("T")[0] : value;
};

const addHours = (value: Date, hours: number) =>
  new Date(value.getTime() + hours * 60 * 60 * 1000);

const addDays = (value: Date, days: number) =>
  new Date(value.getTime() + days * 24 * 60 * 60 * 1000);

const makeDateTime = (date: string, time?: string) => {
  const datePart = extractDatePart(date);

  if (!datePart) {
    return new Date(NaN);
  }

  return new Date(`${datePart}T${normalizeTime(time)}`);
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const rangeFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export type EventDateShape = {
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
};

export type NormalizedEventDates = {
  start: Date;
  endDisplay: Date;
  endCalendar: Date;
  isAllDay: boolean;
  hasExplicitEnd: boolean;
};

export const normalizeEventDates = ({
  date,
  endDate,
  startTime,
  endTime,
}: EventDateShape): NormalizedEventDates => {
  const isTimed = Boolean(startTime || endTime);
  const start = makeDateTime(date, startTime);

  if (isTimed) {
    const hasExplicitEnd = Boolean(endTime || endDate);
    const endCandidate = makeDateTime(endDate ?? date, endTime ?? startTime);
    const calendarEnd = hasExplicitEnd ? endCandidate : addHours(start, 1);

    return {
      start,
      endDisplay: hasExplicitEnd ? endCandidate : start,
      endCalendar: calendarEnd,
      isAllDay: false,
      hasExplicitEnd,
    };
  }

  const displayEnd = makeDateTime(endDate ?? date, undefined);

  return {
    start,
    endDisplay: displayEnd,
    endCalendar: addDays(displayEnd, 1),
    isAllDay: true,
    hasExplicitEnd: Boolean(endDate),
  };
};

export const formatEventDateRange = (input: EventDateShape) => {
  const { start, endDisplay, isAllDay, hasExplicitEnd } = normalizeEventDates(
    input,
  );
  const sameDay =
    start.toDateString() === endDisplay.toDateString() || !hasExplicitEnd;

  if (sameDay) {
    const dateLabel = dateFormatter.format(start);

    if (isAllDay) {
      return dateLabel;
    }

    if (!hasExplicitEnd) {
      return `${dateLabel} · ${timeFormatter.format(start)}`;
    }

    return `${dateLabel} · ${timeFormatter.format(start)} – ${timeFormatter.format(endDisplay)}`;
  }

  if (isAllDay) {
    return `${rangeFormatter.format(start)} – ${rangeFormatter.format(endDisplay)}`;
  }

  return `${rangeFormatter.format(start)} ${timeFormatter.format(start)} – ${rangeFormatter.format(endDisplay)} ${timeFormatter.format(endDisplay)}`;
};

export const formatEventPrimaryDate = (input: EventDateShape) => {
  const { start } = normalizeEventDates(input);
  return dateFormatter.format(start);
};
