export type TTimeIntervalType = "Y" | "M" | "Q" | "W" | "D" | "H" | "m" | "s";
export type TDelimiter = "-" | ":" | "/" | "." | " ";

export type TValidTimePatterns =
  | "Y"
  | `Y${TDelimiter}M`
  | `Y${TDelimiter}M${TDelimiter}D`
  | `Y${TDelimiter}M${TDelimiter}D${TDelimiter}H`
  | `Y${TDelimiter}M${TDelimiter}D${TDelimiter}H${TDelimiter}m`
  | `Y${TDelimiter}M${TDelimiter}D${TDelimiter}H${TDelimiter}m${TDelimiter}s`
  | `H${TDelimiter}m`
  | `H${TDelimiter}m${TDelimiter}s`
  | `m${TDelimiter}s`
  | `W`
  | `Q`
  | `Y${TDelimiter}Q`;

/*
    const dateFormatsKernel: TTimeParserKernel = {
      patterns: [
        "YYYY-MM-DD",
        "YYYY/MM/DD",
        "MM/DD/YYYY",
        "DD-MM-YYYY",
        "YYYY-MM",
        "MM/YYYY",
      ],
    };
*/

const defaultTimeParserKernel: TTimeParserKernel = {
  patterns: [
    // 2025-01-01
    "YYYY-MM-DD",

    // 2025/01/01
    "YYYY/MM/DD",

    // 01/01/2025
    "MM/DD/YYYY",

    // European format
    "DD.MM.YYYY",

    // 01-01-2025
    "DD-MM-YYYY",

    // 2025-01
    "YYYY-MM",

    // 01/2025
    "MM/YYYY",

    // Q2/2025
    "'Q'Q/YYYY",

    // 2025/Q2
    "YYYY/'Q'Q",

    // 2025Q2
    "YYYY'Q'Q",

    // 2025/1
    "YYYY/M",

    // 2025
    "YYYY",

    // 2025/01
    "M/YYYY",

    // 08:30:22
    "HH:mm:ss",

    // 08:30
    "HH:mm",

    // 8:30:22
    "H:mm:s", // Durations

    // 3 years
    "Y' years'",
    "YY' years'",
    "YYY' years'",
    "YYYY' years'",

    // 1 year
    "Y' year'",

    // 2 querters
    "Q' quarters'",
    "QQ' quarters'",

    // 1 querter
    "Q' quarter'",

    // 2 months
    "M' months'",
    "MM' months'",

    // 1 month
    "M' month'",

    // 5 weeks
    "W' weeks'",

    // 5 days
    "D' days'",
    "DD' days'",

    // 1 day
    "D' day'",

    // 3 hours
    "H' hours'",
    "HH' hours'",
    "HHH' hours'",

    // 1 hour
    "H' hour'",

    // 30 minutes
    "m' minutes'",

    // 1 minute
    "m' minute'",
    "mm' minutes'",
    "mmm' minutes'",

    // 45 seconds
    "s' seconds'",
    "ss' seconds'",
    "sss' seconds'",

    // 1 second
    "s' second'",
  ],
};

// Time value pattern list that should be matched
export type TTimeParserKernel = {
  patterns: string[];
};

export interface TTimeInterval {
  type: TTimeIntervalType;
  value: number;
  increment?: TTimeInterval;
}

export type TTime = TTimeInterval;

export interface TTimeSpan {
  start: TTimeInterval;
  end: TTimeInterval;
}

function createInteval(value: number, type: TTimeIntervalType): TTimeInterval {
  return { type, value };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getSecondsAtStartOfYear(year: number): number {
  // Calculate the number of seconds from the start of the year to the given date
  const zeroYear = Date.UTC(0, 0, 1, 0, 0, 0);
  const zeroSeconds = Math.floor(zeroYear / 1000);
  const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  return Math.floor(startOfYear.getTime() / 1000) - zeroSeconds;
}

function getSecondsAtStartOfMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month. Month must be between 1 and 12.");
  }
  const zeroYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const zeroSeconds = Math.floor(zeroYear.getTime() / 1000);
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  return Math.floor(startOfMonth.getTime() / 1000) - zeroSeconds;
}

export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month. Month must be between 1 and 12.");
  }
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28; // February
  }
  return [31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]; // Other months
}

export const getZeroIndexForUnit = (type: TTimeIntervalType): number => {
  // for example, if the type is "Y" (year), the zero index is 0
  // but for "M" (month), the zero index is 1
  switch (type) {
    case "Y":
      return 0; // Years start at 0
    case "M":
      return 1; // Months start at 1 (January)
    case "Q":
      return 1; // Quarters start at 1 (Q1)
    case "W":
      return 1; // Weeks start at 1
    case "D":
      return 1; // Days start at 0
    case "H":
      return 0; // Hours start at 0
    case "m":
      return 0; // Minutes start at 0
    case "s":
      return 0; // Seconds start at 0
    default:
      throw new Error("Invalid time interval type");
  }
};

export const getDayNumber = (time: TTimeInterval): number => {
  if (time.type === "Y" && time.increment && time.increment.type === "M") {
    if (time.increment.increment && time.increment.increment.type === "D") {
      return time.increment.increment.value;
    }
  }
  return 1;
};

export const getMonthNumber = (time: TTimeInterval): number => {
  if (time.type === "Y" && time.increment && time.increment.type === "M") {
    return time.increment.value;
  }

  if (time.type === "M") {
    return time.value;
  }

  if (time.type === "Q") {
    // If the type is Q, we can calculate the month based on the quarter
    return (time.value - 1) * 3 + 1; // Q1 -> Jan, Q2 -> Apr, Q3 -> Jul, Q4 -> Oct
  }

  if (time.type === "W") {
    // If the type is W, we can calculate the month based on the week
    const month = Math.ceil(time.value / 4); // Approximate month from weeks
    return month;
  }

  if (time.type === "D") {
    // If the type is days, we can calculate the month based on the day
    const month = Math.ceil(time.value / 30); // Approximate month from days
    return month;
  }

  return 1; // Default to January
};

export const getWeekNumber = (time: TTimeInterval): number => {
  if (time.increment && time.increment.type === "W") {
    return time.increment.value;
  }

  if (time.type === "W") {
    return time.value; // If the type is already W, return its value
  }

  if (time.type === "D") {
    // If the type is days, we can calculate the week based on the day
    return Math.ceil(time.value / 7); // Approximate week from days
  }

  if (time.type === "Y") {
    if (time.increment?.type === "M") {
      if (time.increment.increment && time.increment.increment.type === "D") {
        // If the increment is defined in days, we can calculate the week based on the day
        return Math.ceil(time.increment.increment.value / 7); // Approximate week from days
      }

      // If the type is Y and increment is M, we can calculate the week based on the month
      const month = time.increment.value;
      return Math.ceil((month * 4) / 7); // Approximate week from months
    }
  }

  return 1; // Default to week 1
};

export const getQuarterNumber = (time: TTimeInterval) => {
  if (time.increment && time.increment?.type === "Q") {
    return time.increment.value;
  }

  if (time.increment && time.increment?.type === "M") {
    // If the start is defined in months, we can calculate the quarter
    const month = time.increment.value;
    if (month <= 3) return 1; // Q1
    if (month <= 6) return 2; // Q2
    if (month <= 9) return 3; // Q3
    if (month <= 12) return 4; // Q4
  }

  if (time.type === "Q") {
    return time.value; // If the type is already Q, return its value
  }

  if (time.type === "W") {
    if (time.value < 13) return 1;
    if (time.value < 26) return 2;
    if (time.value < 39) return 3;
    return 4;
  }

  if (time.type === "D") {
    // If the type is days, we can calculate the quarter based on the month
    const month = Math.ceil(time.value / 30); // Approximate month from days
    if (month <= 3) return 1; // Q1
    if (month <= 6) return 2; // Q2
    if (month <= 9) return 3; // Q3
    return 4; // Q4
  }

  return 1; // Default to Q1
};

export const convertTimeIntervalUnitToSeconds = (
  type: TTimeIntervalType,
  year: number | null = null
): number => {
  switch (type) {
    case "Y":
      if (year !== null) {
        if (isLeapYear(year)) {
          return 366 * 24 * 60 * 60; // Leap year to seconds
        }
      }
      return 365 * 24 * 60 * 60; // Years to seconds
    case "M":
      return 30 * 24 * 60 * 60; // Months to seconds (approx)
    case "Q":
      return 3 * 30 * 24 * 60 * 60; // Quarters to seconds (approx)
    case "W":
      return 7 * 24 * 60 * 60; // Weeks to seconds
    case "D":
      return 24 * 60 * 60; // Days to seconds
    case "H":
      return 60 * 60; // Hours to seconds
    case "m":
      return 60; // Minutes to seconds
    case "s":
      return 1; // Seconds
    default:
      throw new Error("Invalid time interval type");
  }
};

export const convertToSeconds = (
  time: TTimeInterval,
  isDelta = false,
  year: number | null = null
): number => {
  if (!time || typeof time.value !== "number" || time.value < 0) {
    throw new Error("Invalid time interval");
  }

  let currentYear = year;

  if (time.type === "Y" && currentYear === null) {
    currentYear = time.value;
  }

  const getValue = () => {
    if (time.type === "Y") {
      return getSecondsAtStartOfYear(time.value);
    }

    if (time.type === "M" && currentYear !== null) {
      // For months, we need to calculate the seconds at the start of the month
      return getSecondsAtStartOfMonth(currentYear, time.value);
    }

    if (time.type === "Q" && currentYear) {
      switch (time.value) {
        case 1:
          return getSecondsAtStartOfMonth(currentYear, 1);
        case 2:
          return getSecondsAtStartOfMonth(currentYear, 4);
        case 3:
          return getSecondsAtStartOfMonth(currentYear, 7);
        case 4:
          return getSecondsAtStartOfMonth(currentYear, 10);
      }
    }

    const unitInSeconds = convertTimeIntervalUnitToSeconds(
      time.type,
      currentYear
    );

    const zeroIndex = isDelta ? getZeroIndexForUnit(time.type) : 0;

    return (time.value - zeroIndex) * unitInSeconds;
  };

  const unitInSeconds = convertTimeIntervalUnitToSeconds(
    time.type,
    currentYear
  );

  const value = getValue();

  if (time.increment) {
    // Make sure that the increment is smaller than the main unit, for example you can not
    // have month + year but you can have year + month in the order
    const incrementDelta = convertTimeIntervalUnitToSeconds(
      time.increment.type,
      currentYear
    );
    if (incrementDelta >= unitInSeconds) {
      throw new Error("Invalid increment ");
    }
    return value + convertToSeconds(time.increment, true, currentYear);
  }
  return value;
};

export function getTimeDifferenceInSeconds(
  start: TTimeInterval,
  end: TTimeInterval
): number {
  const startInSeconds = convertToSeconds(start);
  const endInSeconds = convertToSeconds(end);
  return endInSeconds - startInSeconds;
}

export function getTimeDifferenceInUnit(
  start: TTimeInterval,
  end: TTimeInterval,
  unit: TTimeIntervalType
): number {
  const secondsDifference = getTimeDifferenceInSeconds(start, end);

  const getRoudingFactor = (unit: TTimeIntervalType): number => {
    switch (unit) {
      case "s":
        return 1;
      case "m":
        return 60;
      case "H":
        return 2;
      case "D":
        return 4;
      case "W":
        return 4;
      case "M":
        return 4;
      case "Y":
        return 4; // Approximation
      case "Q":
        return 4; // Approximation
      default:
        throw new Error("Invalid time accuracy unit:  " + unit);
    }
  };

  const factor = getRoudingFactor(unit);

  const getValue = () => {
    switch (unit) {
      case "s":
        return secondsDifference;
      case "m":
        return secondsDifference / 60;
      case "H":
        return secondsDifference / (60 * 60);
      case "D":
        return secondsDifference / (24 * 60 * 60);
      case "W":
        return secondsDifference / (7 * 24 * 60 * 60);
      case "M":
        return secondsDifference / (30 * 24 * 60 * 60); // Approximation
      case "Y":
        return secondsDifference / (365 * 24 * 60 * 60); // Approximation
      case "Q":
        return secondsDifference / (90 * 24 * 60 * 60); // Approximation for quarters
      default:
        throw new Error("Invalid time accuracy unit");
    }
  };
  return Math.round(getValue() * factor) / factor; // Round to tenth
}

/**
 * Calculate where a time value falls within a time span as a percentage (0-1)
 * @param span The time span (start and end)
 * @param timeValue The time value to locate within the span
 * @returns A value between 0 and 1 representing the position within the span, or -1 if outside the span
 */
export function calculateTimeSlot(span: TTimeSpan, timeValue: TTime): number {
  const spanStartSeconds = convertToSeconds(span.start);
  const spanEndSeconds = convertToSeconds(span.end);
  const valueSeconds = convertToSeconds(timeValue);

  // Calculate position as a percentage (0-1)
  const totalSpanSeconds = spanEndSeconds - spanStartSeconds;
  const secondsFromStart = valueSeconds - spanStartSeconds;

  return secondsFromStart / totalSpanSeconds;
}

const TimeIntervalTypesMatchOrder: TTimeIntervalType[] = [
  "Y",
  "M",
  "Q",
  "W",
  "D",
  "H",
  "m",
  "s",
];

export function isValidTimeIntervalType(
  char: string
): char is TTimeIntervalType {
  return TimeIntervalTypesMatchOrder.includes(char as TTimeIntervalType);
}

/**
 * Convert a time string to a TTimeInterval object
 * @param timeString The time string to convert
 * @param format The format of the time string, e.g. "YYYY-MM-DD HH:mm:ss"
 * @returns A TTimeInterval object representing the time
 */
export function parseTimeString(
  timeString: string,
  format: string | TTimeParserKernel = defaultTimeParserKernel
): TTimeInterval {
  if (typeof format === "object" && format.patterns) {
    const kernel = format as TTimeParserKernel;
    for (const pattern of kernel.patterns) {
      try {
        return parseTimeString(timeString, pattern);
      } catch {
        // Ignore the error and try the next pattern
      }
    }
    throw new Error(
      `Invalid time string: ${timeString}. No valid patterns found in the kernel.`
    );
  }

  const valueString = timeString.trim();
  const formatStr = (format as string).trim();

  let currentTime: TTimeInterval | null = null;

  let lastTimeIntervalType: TTimeIntervalType | null = null;

  const listOfIntervals: TTimeInterval[] = [];

  const formatStringLength = formatStr.length;
  let formatStringPosition = 0;
  let parserStringPosition = 0;

  while (formatStringPosition < formatStringLength) {
    // Move forward
    let format_index = formatStringPosition++;
    let char = formatStr[format_index];
    let tokenLen = 0;

    if (char === "'") {
      // Escape single quotes in the format string
      // Skip until the next single quote

      while (
        formatStringPosition < formatStringLength &&
        formatStr[formatStringPosition] !== "'"
      ) {
        if (formatStr[formatStringPosition] !== "'") {
          const charAtPosition = valueString[parserStringPosition + tokenLen];
          if (charAtPosition !== formatStr[formatStringPosition]) {
            throw new Error(
              `Invalid time string: ${timeString}. Expected '${char}' at position ${
                parserStringPosition + tokenLen
              }, but found '${charAtPosition}'`
            );
          }
          tokenLen++;
        }
        formatStringPosition++;
      }
      format_index = formatStringPosition++;
      char = formatStr[format_index];
      parserStringPosition += tokenLen;
      continue;
    } else {
      tokenLen = 1;
    }

    const i = parserStringPosition;
    parserStringPosition += tokenLen;

    if (!isValidTimeIntervalType(char)) {
      if (char !== valueString[i]) {
        throw new Error(
          `Invalid time string: ${timeString}. Expected '${char}' at position ${i}, but found '${valueString[i]}'`
        );
      }
      continue; // Skip invalid characters
    }

    const getValue = () => {
      const charValue = valueString[i];
      const numberValue = parseInt(charValue, 10);
      if (isNaN(numberValue)) {
        throw new Error(`Invalid time string: ${timeString}`);
      }
      return numberValue;
    };

    if (char !== lastTimeIntervalType) {
      if (!currentTime) {
        // Initialize resultTime if it doesn't exist
        currentTime = { type: char as TTimeIntervalType, value: getValue() };
      } else {
        listOfIntervals.push(currentTime!);
        currentTime = { type: char as TTimeIntervalType, value: getValue() };
      }
      lastTimeIntervalType = char as TTimeIntervalType;
    } else {
      currentTime!.value = currentTime!.value * 10 + getValue();
    }
  }

  if (currentTime && !listOfIntervals.includes(currentTime)) {
    listOfIntervals.push(currentTime);
  }

  // Sort the intervals based on the order defined in TimeIntervalTypesMatchOrder
  listOfIntervals.sort((a, b) => {
    const indexA = TimeIntervalTypesMatchOrder.indexOf(a.type);
    const indexB = TimeIntervalTypesMatchOrder.indexOf(b.type);
    return indexA - indexB;
  });

  if (listOfIntervals.length === 0) {
    throw new Error(
      `Invalid time string: ${timeString}. No valid time intervals found.`
    );
  }

  const result = listOfIntervals[0];

  for (let i = 0; i < listOfIntervals.length; i++) {
    const next = listOfIntervals[i + 1];
    const current = listOfIntervals[i];
    if (
      next &&
      TimeIntervalTypesMatchOrder.indexOf(next.type) >
        TimeIntervalTypesMatchOrder.indexOf(result.type)
    ) {
      current.increment = next;
    }
  }

  return result;
}

export function dateToTimeInterval(
  origDate: Date,
  accuracy: TTimeIntervalType
): TTimeInterval {
  const date = new Date(origDate.getTime());
  // Create a copy of the date to avoid mutating the original
  // do rounding based on the accuracy so that if the month is July or later, it rounds to the next year
  // if the day of month is greater than 15, it rounds to the next month
  // if the hour is greater than 12, it rounds to the next hour
  // if the minute is greater than 30, it rounds to the next minute

  let incrementValue = 0;
  switch (accuracy) {
    case "Y":
      // Round to the next year if the month is July or later
      incrementValue = date.getUTCMonth() >= 6 ? 1 : 0;

      break;
    case "M":
      // Round to the next month if the day is greater than 15
      incrementValue = date.getUTCDate() > 15 ? 1 : 0;

      if (date.getUTCMonth() + 1 + incrementValue > 12) {
        incrementValue = -11;
      }
      break;
    case "D":
      // Round to the next day if the hour is greater than 12
      incrementValue = date.getUTCHours() >= 12 ? 1 : 0;
      break;
    case "H":
      // Round to the next hour if the minute is greater than 30
      incrementValue = date.getUTCMinutes() >= 30 ? 1 : 0;
      break;
    case "m":
      // Round to the next minute if the second is greater than or equal to 30
      incrementValue = date.getUTCSeconds() >= 30 ? 1 : 0;
      break;
  }

  switch (accuracy) {
    case "Y":
      return { type: "Y", value: date.getUTCFullYear() + incrementValue };
    case "M":
      return {
        type: "Y",
        value: date.getUTCFullYear(),
        increment: {
          type: "M",
          value: date.getUTCMonth() + 1 + incrementValue,
        },
      };
    case "D":
      return {
        type: "Y",
        value: date.getUTCFullYear(),
        increment: {
          type: "M",
          value: date.getUTCMonth() + 1,
          increment: { type: "D", value: date.getUTCDate() + incrementValue },
        },
      };
    case "H":
      return {
        type: "Y",
        value: date.getUTCFullYear(),
        increment: {
          type: "M",
          value: date.getUTCMonth() + 1,
          increment: {
            type: "D",
            value: date.getUTCDate(),
            increment: {
              type: "H",
              value: date.getUTCHours() + incrementValue,
            },
          },
        },
      };
    case "m":
      return {
        type: "Y",
        value: date.getUTCFullYear(),
        increment: {
          type: "M",
          value: date.getUTCMonth() + 1,
          increment: {
            type: "D",
            value: date.getUTCDate(),
            increment: {
              type: "H",
              value: date.getUTCHours(),
              increment: {
                type: "m",
                value: date.getUTCMinutes() + incrementValue,
              },
            },
          },
        },
      };
    case "s":
      return {
        type: "Y",
        value: date.getUTCFullYear(),
        increment: {
          type: "M",
          value: date.getUTCMonth() + 1,
          increment: {
            type: "D",
            value: date.getUTCDate(),
            increment: {
              type: "H",
              value: date.getUTCHours(),
              increment: {
                type: "m",
                value: date.getUTCMinutes(),
                increment: {
                  type: "s",
                  value: date.getUTCSeconds() + incrementValue,
                },
              },
            },
          },
        },
      };
    case "W": {
      const startOfWeek = new Date(date);
      startOfWeek.setUTCDate(date.getUTCDate() - date.getUTCDay()); // Set to the start of the week (Sunday)
      return {
        type: "Y",
        value: startOfWeek.getUTCFullYear(),
        increment: {
          type: "M",
          value: startOfWeek.getUTCMonth() + 1,
          increment: {
            type: "D",
            value: startOfWeek.getUTCDate(),
            increment: { type: "W", value: 1 },
          },
        },
      };
    }
    case "Q": {
      const quarter = Math.floor(date.getUTCMonth() / 3) + 1; // 1 for Jan-Mar, 2 for Apr-Jun, etc.
      return {
        type: "Y",
        value: date.getUTCFullYear(),
        increment: { type: "Q", value: quarter },
      };
    }
    default:
      throw new Error(`Unsupported accuracy type: ${accuracy}`);
  }
}

export function timeIntervalToDate(
  time: TTimeInterval,
  accuracy: TTimeIntervalType
): Date {
  if (time.type === "Y") {
    const rootDate = new Date(Date.UTC(time.value, 0, 1, 0, 0, 0)); // January 1st of the year
    if (time.increment) {
      if (time.increment.type === "Q") {
        const quarterStartMonth = (time.increment.value - 1) * 3; // 0 for Q1, 3 for Q2, etc.
        rootDate.setUTCMonth(quarterStartMonth);
      }
      if (time.increment.type === "M") {
        rootDate.setUTCMonth(time.increment.value - 1); // Set month (0-indexed)
        const days = time.increment.increment;
        if (days && days.type === "D") {
          rootDate.setUTCDate(days.value); // Set day of the month
          const hours = days.increment;
          if (hours && hours.type === "H") {
            rootDate.setUTCHours(hours.value); // Set hour of the day
            const minutes = hours.increment;
            if (minutes && minutes.type === "m") {
              rootDate.setUTCMinutes(minutes.value); // Set minute of the hour
              const seconds = minutes.increment;
              if (seconds && seconds.type === "s") {
                rootDate.setUTCSeconds(seconds.value); // Set second of the minute
              }
            }
          }
        }
      }
    }
    return rootDate;
  }

  switch (accuracy) {
    case "Y":
      return new Date(Date.UTC(time.value, 0, 1, 0, 0, 0)); // January 1st of the year
    case "M":
      return new Date(
        Date.UTC(time.value, time.increment!.value - 1, 1, 0, 0, 0)
      ); // First day of the month
    case "D":
      return new Date(
        Date.UTC(
          time.value,
          time.increment!.value - 1,
          time.increment!.increment!.value,
          0,
          0,
          0
        )
      ); // Specific day of the month    case "H":
      return new Date(
        Date.UTC(
          time.value,
          time.increment!.value - 1,
          time.increment!.increment!.value,
          time.increment!.increment!.increment!.value,
          0,
          0
        )
      ); // Specific hour of the day
    case "m":
      return new Date(
        Date.UTC(
          time.value,
          time.increment!.value - 1,
          time.increment!.increment!.value,
          time.increment!.increment!.increment!.value,
          time.increment!.increment!.increment!.increment!.value,
          0
        )
      ); // Specific minute of the hour
    case "s":
      return new Date(
        Date.UTC(
          time.value,
          time.increment!.value - 1,
          time.increment!.increment!.value,
          time.increment!.increment!.increment!.value,
          time.increment!.increment!.increment!.increment!.value,
          time.increment!.increment!.increment!.increment!.increment!.value
        )
      ); // Specific second of the minute
    case "W":
      return timeIntervalToDate(time, "D");
    case "Q": {
      const findQuarterFromTime = (t: TTimeInterval): number => {
        if (t.type === "Q") {
          return t.value;
        } else if (t.increment) {
          return findQuarterFromTime(t.increment);
        }
        return -1;
      };
      const q = findQuarterFromTime(time);
      if (q !== -1) {
        switch (q) {
          case 1:
            return new Date(Date.UTC(time.value, 0, 1, 0, 0, 0)); // January 1st of Q1
          case 2:
            return new Date(Date.UTC(time.value, 3, 1, 0, 0, 0)); // April 1st of Q2
          case 3:
            return new Date(Date.UTC(time.value, 6, 1, 0, 0, 0)); // July 1st of Q3
          case 4:
            return new Date(Date.UTC(time.value, 9, 1, 0, 0, 0)); // October 1st of Q4
          default:
            throw new Error(`Invalid quarter value: ${q}`);
        }
      }
      const quarterStartMonth = (time.increment!.value - 1) * 3; // 0 for Q1, 3 for Q2, etc.
      return new Date(Date.UTC(time.value, quarterStartMonth, 1, 0, 0, 0)); // First day of the quarter
    }
    default:
      throw new Error(`Unsupported accuracy type: ${accuracy}`);
  }
}

export function isTimeInRange({
  time,
  range,
}: {
  time: TTimeInterval;
  range: { start: TTimeInterval; end: TTimeInterval };
}): boolean {
  const timeInSeconds = convertToSeconds(time);
  const startInSeconds = convertToSeconds(range.start);
  const endInSeconds = convertToSeconds(range.end);

  return timeInSeconds >= startInSeconds && timeInSeconds <= endInSeconds;
}

export function convertSecondsToTimeInterval(
  seconds: number,
  type: TTimeIntervalType
): TTimeInterval {
  return createInteval(
    getTimeDifferenceInUnit(
      createInteval(0, "s"),
      createInteval(seconds, "s"),
      type
    ),
    type
  );
}

export function splitTimeRangeIntoIntervals(
  range: { start: TTimeInterval; end: TTimeInterval },
  interval: TTimeIntervalType
): TTimeInterval[] {
  if (range.start.type === interval && range.end.type === interval) {
    const res: TTimeInterval[] = [];
    for (let i = range.start.value; i <= range.end.value; i++) {
      const timeInterval: TTimeInterval = {
        type: interval,
        value: i,
      };
      res.push(timeInterval);
    }
    return res;
  }

  // Year ranges pre
  if (range.start.type === "Y" && range.end.type === "Y") {
    if (interval === "Q") {
      const res: TTimeInterval[] = [];
      for (let i = range.start.value; i <= range.end.value; i++) {
        // for the first index ( i === range.start.value), check if the start quarter is defined

        const startQuarter =
          range.start.value === i ? getQuarterNumber(range.start) : 1;
        const endQuarter =
          range.end.value === i ? getQuarterNumber(range.end) : 4;

        for (let j = startQuarter; j <= endQuarter; j++) {
          const timeInterval: TTimeInterval = {
            type: "Y",
            value: i,
            increment: { type: "Q", value: j },
          };
          res.push(timeInterval);
        }
      }
      return res;
    }

    if (interval === "M") {
      const res: TTimeInterval[] = [];
      for (let i = range.start.value; i <= range.end.value; i++) {
        // for the first index ( i === range.start.value), check if the start month is defined
        const startMonth =
          i === range.start.value ? getMonthNumber(range.start) : 1;
        const endMonth = i === range.end.value ? getMonthNumber(range.end) : 12;

        for (let j = startMonth; j <= endMonth; j++) {
          const timeInterval: TTimeInterval = {
            type: "Y",
            value: i,
            increment: { type: "M", value: j },
          };
          res.push(timeInterval);
        }
      }
      return res;
    }

    if (interval === "W") {
      const res: TTimeInterval[] = [];
      for (let i = range.start.value; i <= range.end.value; i++) {
        // for the first index ( i === range.start.value), check if the start week is defined
        const startWeek =
          i === range.start.value ? getWeekNumber(range.start) : 1;
        const endWeek = i === range.end.value ? getWeekNumber(range.end) : 52;

        for (let j = startWeek; j <= endWeek; j++) {
          const timeInterval: TTimeInterval = {
            type: "Y",
            value: i,
            increment: { type: "W", value: j },
          };
          res.push(timeInterval);
        }
      }
      return res;
    }

    if (interval === "D") {
      const res: TTimeInterval[] = [];
      for (let i = range.start.value; i <= range.end.value; i++) {
        // for the first index ( i === range.start.value), check if the start day is defined

        const startMonth =
          range.start.value === i ? getMonthNumber(range.start) : 1;
        const endMonth = range.end.value === i ? getMonthNumber(range.end) : 12;

        for (let m = startMonth; m <= endMonth; m++) {
          const daysInMonth = getDaysInMonth(i, m);
          const startDay =
            i === range.start.value && m === startMonth
              ? getDayNumber(range.start)
              : 1;
          const endDay =
            i === range.end.value && m === endMonth
              ? getDayNumber(range.end)
              : daysInMonth;

          for (let d = startDay; d <= endDay; d++) {
            const timeInterval: TTimeInterval = {
              type: "Y",
              value: i,
              increment: {
                type: "M",
                value: m,
                increment: { type: "D", value: d },
              },
            };
            res.push(timeInterval);
          }
        }
      }
      return res;
    }
  }

  const dateStart = timeIntervalToDate(range.start, interval);
  const dateEnd = timeIntervalToDate(range.end, interval);

  const intervalInSeconds = convertTimeIntervalUnitToSeconds(interval);

  const intervals: TTimeInterval[] = [];

  let timeNow = new Date(dateStart.getTime());

  const endStartDiff = getTimeDifferenceInSeconds(range.start, range.end);

  if (endStartDiff < intervalInSeconds) {
    return [range.start];
  }

  console.log(range.start, range.end, interval);
  console.log(
    `Splitting time range from ${dateStart.toISOString()} to ${dateEnd.toISOString()} by ${interval}`
  );

  while (true) {
    // increment the time by the interval

    const currentInterval = dateToTimeInterval(timeNow, interval);
    intervals.push(currentInterval);

    timeNow = new Date(timeNow.getTime() + intervalInSeconds * 1000);

    const diff = getTimeDifferenceInUnit(
      dateToTimeInterval(timeNow, interval),
      range.end,
      interval
    );
    if (diff < 0) {
      break;
    }
  }

  return intervals;
}

export function findSubAccuracy(
  time: TTimeInterval,
  accuracy: TTimeIntervalType
): TTimeInterval | null {
  if (time.type === accuracy) {
    return time;
  }

  if (time.increment) {
    const subAccuracy = findSubAccuracy(time.increment, accuracy);
    if (subAccuracy) {
      return subAccuracy;
    }
  }

  return null;
}

export function flattenResults(
  times: TTimeInterval[],
  accuracy: TTimeIntervalType
): TTimeInterval[] {
  if (times.length === 0) {
    return [];
  }

  const flattened: TTimeInterval[] = [];
  for (const time of times) {
    const subAccuracy = findSubAccuracy(time, accuracy);
    if (subAccuracy) {
      flattened.push(subAccuracy);
    } else {
      // If no sub-accuracy found, push the original time
      flattened.push(time);
    }
  }
  return flattened;
}
