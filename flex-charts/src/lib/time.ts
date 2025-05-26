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

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getSecondsAtStartOfYear(year: number): number {
  // Calculate the number of seconds from the start of the year to the given date
  const zeroYear = new Date(0, 0, 1, 0, 0, 0);
  const zeroSeconds = Math.floor(zeroYear.getTime() / 1000);
  const startOfYear = new Date(year, 0, 1, 0, 0, 0);
  return Math.floor(startOfYear.getTime() / 1000) - zeroSeconds;
}

function getSecondsAtStartOfMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month. Month must be between 1 and 12.");
  }
  const zeroYear = new Date(year, 0, 1, 0, 0, 0);
  const zeroSeconds = Math.floor(zeroYear.getTime() / 1000);
  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0);
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

  const zeroIndex = isDelta ? getZeroIndexForUnit(time.type) : 0;

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
  format: string
): TTimeInterval {
  const valueString = timeString.trim();
  const formatStr = format.trim();

  let currentTime: TTimeInterval | null = null;

  let lastTimeIntervalType: TTimeIntervalType | null = null;

  const listOfIntervals: TTimeInterval[] = [];

  for (let i = 0; i < formatStr.length; i++) {
    const char = formatStr[i];

    if (!isValidTimeIntervalType(char)) {
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
    return { type: "s", value: 0 };
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
  date: Date,
  accuracy: TTimeIntervalType
): TTimeInterval {
  switch (accuracy) {
    case "Y":
      return { type: "Y", value: date.getFullYear() };
    case "M":
      return {
        type: "Y",
        value: date.getFullYear(),
        increment: { type: "M", value: date.getMonth() + 1 },
      };
    case "D":
      return {
        type: "Y",
        value: date.getFullYear(),
        increment: {
          type: "M",
          value: date.getMonth() + 1,
          increment: { type: "D", value: date.getDate() },
        },
      };
    case "H":
      return {
        type: "Y",
        value: date.getFullYear(),
        increment: {
          type: "M",
          value: date.getMonth() + 1,
          increment: {
            type: "D",
            value: date.getDate(),
            increment: { type: "H", value: date.getHours() },
          },
        },
      };
    case "m":
      return {
        type: "Y",
        value: date.getFullYear(),
        increment: {
          type: "M",
          value: date.getMonth() + 1,
          increment: {
            type: "D",
            value: date.getDate(),
            increment: {
              type: "H",
              value: date.getHours(),
              increment: { type: "m", value: date.getMinutes() },
            },
          },
        },
      };
    case "s":
      return {
        type: "Y",
        value: date.getFullYear(),
        increment: {
          type: "M",
          value: date.getMonth() + 1,
          increment: {
            type: "D",
            value: date.getDate(),
            increment: {
              type: "H",
              value: date.getHours(),
              increment: {
                type: "m",
                value: date.getMinutes(),
                increment: { type: "s", value: date.getSeconds() },
              },
            },
          },
        },
      };
    case "W": {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Set to the start of the week (Sunday)
      return {
        type: "Y",
        value: startOfWeek.getFullYear(),
        increment: {
          type: "M",
          value: startOfWeek.getMonth() + 1,
          increment: {
            type: "D",
            value: startOfWeek.getDate(),
            increment: { type: "W", value: 1 },
          },
        },
      };
    }
    case "Q": {
      const quarter = Math.floor(date.getMonth() / 3) + 1; // 1 for Jan-Mar, 2 for Apr-Jun, etc.
      return {
        type: "Y",
        value: date.getFullYear(),
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
  switch (accuracy) {
    case "Y":
      return new Date(time.value, 0, 1, 0, 0, 0); // January 1st of the year
    case "M":
      return new Date(time.value, time.increment!.value - 1, 1, 0, 0, 0); // First day of the month
    case "D":
      return new Date(
        time.value,
        time.increment!.value - 1,
        time.increment!.increment!.value,
        0,
        0,
        0
      ); // Specific day of the month
    case "H":
      return new Date(
        time.value,
        time.increment!.value - 1,
        time.increment!.increment!.value,
        time.increment!.increment!.increment!.value,
        0,
        0
      ); // Specific hour of the day
    case "m":
      return new Date(
        time.value,
        time.increment!.value - 1,
        time.increment!.increment!.value,
        time.increment!.increment!.increment!.value,
        time.increment!.increment!.increment!.increment!.value,
        0
      ); // Specific minute of the hour
    case "s":
      return new Date(
        time.value,
        time.increment!.value - 1,
        time.increment!.increment!.value,
        time.increment!.increment!.increment!.value,
        time.increment!.increment!.increment!.increment!.value,
        time.increment!.increment!.increment!.increment!.increment!.value
      ); // Specific second of the minute
    case "W": {
      const startOfWeek = new Date(time.value, 0, 1, 0, 0, 0);
      startOfWeek.setDate(
        startOfWeek.getDate() + (time.increment!.value - 1) * 7
      ); // Calculate the start of the week
      return startOfWeek;
    }
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
            return new Date(time.value, 0, 1, 0, 0, 0); // January 1st of Q1
          case 2:
            return new Date(time.value, 3, 1, 0, 0, 0); // April 1st of Q2
          case 3:
            return new Date(time.value, 6, 1, 0, 0, 0); // July 1st of Q3
          case 4:
            return new Date(time.value, 9, 1, 0, 0, 0); // October 1st of Q4
          default:
            throw new Error(`Invalid quarter value: ${q}`);
        }
      }
      const quarterStartMonth = (time.increment!.value - 1) * 3; // 0 for Q1, 3 for Q2, etc.
      return new Date(time.value, quarterStartMonth, 1, 0, 0, 0); // First day of the quarter
    }
    default:
      throw new Error(`Unsupported accuracy type: ${accuracy}`);
  }
}
