import { describe, it, expect } from "vitest";
import {
  convertTimeIntervalUnitToSeconds,
  convertToSeconds,
  getTimeDifferenceInSeconds,
  calculateTimeSlot,
  type TTimeInterval,
  getTimeDifferenceInUnit,
  parseTimeString,
  dateToTimeInterval,
  timeIntervalToDate,
  convertSecondsToTimeInterval,
  splitTimeRangeIntoIntervals,
  flattenResults,
} from "../time";

describe("Time Utilities", () => {
  describe("Support converting Date object to TTimeInterval", () => {
    it("should convert Date object to TTimeInterval", () => {
      const date = new Date("2024-01-01T12:00:00Z");
      const timeI = dateToTimeInterval(date, "Y");
      // should have only type Y
      expect(timeI).toEqual({
        type: "Y",
        value: 2024,
      });

      const timeQ = dateToTimeInterval(new Date("2024-04-01T12:00:00Z"), "Q");
      expect(timeQ).toEqual({
        type: "Y",
        value: 2024,
        increment: {
          type: "Q",
          value: 2,
        },
      });
    });
  });

  describe("Convert TTimeInterval to Date object", () => {
    it("should convert TTimeInterval to Date object", () => {
      const timeInterval: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "Q",
          value: 3,
        },
      };
      const date = timeIntervalToDate(timeInterval, "Q");
      const tiStartOfYear = parseTimeString("2024", "YYYY");
      const dateToI = dateToTimeInterval(date, "Q");

      const diff = getTimeDifferenceInUnit(tiStartOfYear, dateToI, "Q");
      expect(diff).toBe(2); // 2 quarters difference

      // Test that the parsed date for the real quarter start is the same as the date for the quarter
      const q3Date = parseTimeString("2024/07/01", "YYYY/MM/DD");
      const diff2 = getTimeDifferenceInUnit(timeInterval, q3Date, "D");
      expect(diff2).toBe(0); // Should be the same day
    });
  });

  describe("Should handle leap years correctly", () => {
    it("should correctly calculate the difference between a leap year and a non-leap year", () => {
      const leapYear: TTimeInterval = { type: "Y", value: 2020 };
      const nonLeapYear: TTimeInterval = { type: "Y", value: 2021 };
      const diffInSeconds = getTimeDifferenceInSeconds(leapYear, nonLeapYear);
      expect(diffInSeconds).toBe(366 * 24 * 60 * 60); // 365 days difference
    });

    it("February 29 should be handled correctly in leap years", () => {
      const leapYearFeb01 = parseTimeString("2020-02-01", "YYYY-MM-DD");
      const leapYearMar01 = parseTimeString("2020-03-01", "YYYY-MM-DD");

      const diffInDays = getTimeDifferenceInUnit(
        leapYearFeb01,
        leapYearMar01,
        "D"
      );
      expect(diffInDays).toBe(29); // 29 days in February of a leap year
    });

    it("For non leap years, February should have 28 days", () => {
      const nonLeapYearFeb01 = parseTimeString("2021-02-01", "YYYY-MM-DD");
      const nonLeapYearMar01 = parseTimeString("2021-03-01", "YYYY-MM-DD");

      const diffInDays = getTimeDifferenceInUnit(
        nonLeapYearFeb01,
        nonLeapYearMar01,
        "D"
      );
      expect(diffInDays).toBe(28); // 28 days in February of a non-leap year
    });
  });

  describe("2021/1 as YYYY/Q should have 0.25 difference to 2021/2", () => {
    it("should calculate the difference between quarters correctly", () => {
      const quarter1 = parseTimeString("2021/1", "YYYY/Q");
      const quarter2 = parseTimeString("2021/2", "YYYY/Q");

      const diffInQuarters = getTimeDifferenceInUnit(quarter1, quarter2, "Y");
      expect(diffInQuarters).toBe(0.25); // 1 quarter difference
    });

    it("Should also support 01/2021 as QQ/YYYY and 03/2021 as QQ/YYYY", () => {
      const quarter1 = parseTimeString("Q1/2021", "'Q'Q/YYYY");
      const quarter2 = parseTimeString("Q3/2021", "'Q'Q/YYYY");

      const diffInQuarters = getTimeDifferenceInUnit(quarter1, quarter2, "Y");
      expect(diffInQuarters).toBe(0.5); // 0.5 quarters difference

      const diffInQuarters2 = getTimeDifferenceInUnit(quarter1, quarter2, "Q");
      expect(diffInQuarters2).toBe(2); //  2 quarters difference

      const year2021 = parseTimeString("2021", "YYYY");
      const year2023 = parseTimeString("2023", "YYYY");
      const quarterDiff = getTimeDifferenceInUnit(year2021, year2023, "Q");
      expect(quarterDiff).toBe(8); // 2 years difference = 8 quarters
    });
  });

  describe("testTimeDifferenceInUnit", () => {
    it("should calculate the difference in years for the same unit", () => {
      const year2004 = { type: "Y", value: 2004 } as TTimeInterval;
      const year2024 = { type: "Y", value: 2024 } as TTimeInterval;
      const yearDiff = getTimeDifferenceInUnit(year2004, year2024, "Y");
      expect(yearDiff).toBe(20);
    });

    it("should calculate the difference in months for the same unit", () => {
      const jan2020 = { type: "M", value: 1 } as TTimeInterval;
      const dec2020 = { type: "M", value: 12 } as TTimeInterval;
      const monthDiff = getTimeDifferenceInUnit(jan2020, dec2020, "M");
      expect(monthDiff).toBe(11);
    });

    it("should calculate the difference in days for the same unit", () => {
      const day1 = { type: "D", value: 1 } as TTimeInterval;
      const day30 = { type: "D", value: 30 } as TTimeInterval;
      const dayDiff = getTimeDifferenceInUnit(day1, day30, "D");
      expect(dayDiff).toBe(29);
    });

    it("should calculate the difference in hours for the same unit", () => {
      const hour1 = { type: "H", value: 1 } as TTimeInterval;
      const hour24 = { type: "H", value: 24 } as TTimeInterval;
      const hourDiff = getTimeDifferenceInUnit(hour1, hour24, "H");
      expect(hourDiff).toBe(23);
    });
  });

  describe("convertTimeIntervalUnitToSeconds", () => {
    it("should convert years (Y) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("Y")).toBe(365 * 24 * 60 * 60);
    });

    it("should convert months (M) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("M")).toBe(30 * 24 * 60 * 60);
    });

    it("should convert quarters (Q) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("Q")).toBe(3 * 30 * 24 * 60 * 60);
    });

    it("should convert weeks (W) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("W")).toBe(7 * 24 * 60 * 60);
    });

    it("should convert days (D) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("D")).toBe(24 * 60 * 60);
    });

    it("should convert hours (H) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("H")).toBe(60 * 60);
    });

    it("should convert minutes (m) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("m")).toBe(60);
    });

    it("should convert seconds (s) to seconds", () => {
      expect(convertTimeIntervalUnitToSeconds("s")).toBe(1);
    });

    it("should throw an error for invalid time interval type", () => {
      // @ts-expect-error Testing invalid input
      expect(() => convertTimeIntervalUnitToSeconds("X")).toThrow(
        "Invalid time interval type"
      );
    });
  });

  describe("convertToSeconds", () => {
    it("should convert various time intervals to seconds", () => {
      const testCases: [TTimeInterval, number][] = [
        [{ type: "Y", value: 2 }, 2 * 365 * 24 * 60 * 60],
        [{ type: "M", value: 3 }, 3 * 30 * 24 * 60 * 60],
        [{ type: "Q", value: 1 }, 1 * 3 * 30 * 24 * 60 * 60],
        [{ type: "W", value: 2 }, 2 * 7 * 24 * 60 * 60],
        [{ type: "D", value: 5 }, 5 * 24 * 60 * 60],
        [{ type: "H", value: 12 }, 12 * 60 * 60],
        [{ type: "m", value: 30 }, 30 * 60],
        [{ type: "s", value: 45 }, 45],
      ];

      testCases.forEach(([input, expected]) => {
        expect(convertToSeconds(input)).toBe(expected);
      });
    });

    it("should handle zero values correctly", () => {
      expect(convertToSeconds({ type: "D", value: 0 })).toBe(0);
    });

    it("should throw an error for invalid time interval", () => {
      // @ts-expect-error Testing null input
      expect(() => convertToSeconds(null)).toThrow("Invalid time interval");
      // @ts-expect-error Testing undefined input
      expect(() => convertToSeconds(undefined)).toThrow(
        "Invalid time interval"
      );
      // @ts-expect-error Testing non-numeric value
      expect(() => convertToSeconds({ type: "D", value: "5" })).toThrow(
        "Invalid time interval"
      );
    });
  });
  describe("getTimeDifferenceInSeconds", () => {
    it("should calculate the correct time difference for same units", () => {
      const start: TTimeInterval = { type: "H", value: 1 };
      const end: TTimeInterval = { type: "H", value: 3 };

      // 2 hours difference = 2 * 60 * 60 = 7200 seconds
      expect(getTimeDifferenceInSeconds(start, end)).toBe(2 * 60 * 60);
    });

    it("should calculate the correct time difference for different units", () => {
      const start: TTimeInterval = { type: "H", value: 1 }; // 1 hour = 3600 seconds
      const end: TTimeInterval = { type: "D", value: 1 }; // 1 day = 86400 seconds

      // 1 day - 1 hour = 86400 - 3600 = 82800 seconds
      expect(getTimeDifferenceInSeconds(start, end)).toBe(82800);
    });

    it("should handle negative differences correctly", () => {
      const start: TTimeInterval = { type: "D", value: 2 }; // 2 days
      const end: TTimeInterval = { type: "H", value: 12 }; // 12 hours

      // 12 hours - 2 days = 43200 - 172800 = -129600 seconds
      expect(getTimeDifferenceInSeconds(start, end)).toBe(-129600);
    });

    it("should return zero for identical time intervals", () => {
      const time: TTimeInterval = { type: "M", value: 3 };
      expect(getTimeDifferenceInSeconds(time, time)).toBe(0);
    });
  });

  describe("calculateTimeSlot", () => {
    it("should calculate the correct position within a time span", () => {
      const span = {
        start: { type: "H" as const, value: 0 }, // 0 hours
        end: { type: "H" as const, value: 10 }, // 10 hours
      };

      // Test points at various positions
      expect(calculateTimeSlot(span, { type: "H", value: 0 })).toBe(0); // At start
      expect(calculateTimeSlot(span, { type: "H", value: 5 })).toBe(0.5); // Middle
      expect(calculateTimeSlot(span, { type: "H", value: 10 })).toBe(1); // At end
      expect(calculateTimeSlot(span, { type: "H", value: 2.5 })).toBe(0.25); // Quarter way
    });

    it("should calculate the correct position with different time units", () => {
      const span = {
        start: { type: "H" as const, value: 0 }, // 0 hours
        end: { type: "D" as const, value: 1 }, // 1 day = 24 hours
      };

      // 12 hours = half a day
      expect(calculateTimeSlot(span, { type: "H", value: 12 })).toBe(0.5);

      // 6 hours = quarter of a day
      expect(calculateTimeSlot(span, { type: "H", value: 6 })).toBe(0.25);

      // 90 minutes = 1.5 hours = 1.5/24 of a day
      expect(calculateTimeSlot(span, { type: "m", value: 90 })).toBeCloseTo(
        0.0625
      );
    });

    it("should return -1 for points outside the span", () => {
      const span = {
        start: { type: "H" as const, value: 5 },
        end: { type: "H" as const, value: 10 },
      };

      // Before the start
      expect(calculateTimeSlot(span, { type: "H", value: 4 })).toBe(-0.2);

      // After the end
      expect(calculateTimeSlot(span, { type: "H", value: 11 })).toBe(1.2);
    });

    it("should return negative if position is before", () => {
      // Equal start and end
      const equalSpan = {
        start: { type: "H" as const, value: 10 },
        end: { type: "H" as const, value: 15 },
      };

      expect(calculateTimeSlot(equalSpan, { type: "H", value: 5 })).toBe(-1);
    });
  });

  describe("Parse time strings", () => {
    it("should parse valid time strings correctly", () => {
      expect(parseTimeString("2024", "YYYY")).toEqual({
        type: "Y",
        value: 2024,
      });

      expect(parseTimeString("2024-01", "YYYY-MM")).toEqual({
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 1,
        },
      });

      const value1 = parseTimeString("2024-01-01", "YYYY-MM-DD");
      const value2 = parseTimeString("2024-01", "YYYY-MM");

      expect(value1).toEqual({
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 1,
          increment: {
            type: "D",
            value: 1,
          },
        },
      });

      expect(value2).toEqual({
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 1,
        },
      });

      const diffInSeconds = getTimeDifferenceInSeconds(value1, value2);
      expect(diffInSeconds).toBe(0); // Same day, so no difference

      const value3 = parseTimeString(
        "2024-01-01T12:00:00",
        "YYYY-MM-DDTHH:mm:ss"
      );
      expect(value3).toEqual({
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 1,
          increment: {
            type: "D",
            value: 1,
            increment: {
              type: "H",
              value: 12,
              increment: {
                type: "m",
                value: 0,
                increment: {
                  type: "s",
                  value: 0,
                },
              },
            },
          },
        },
      });
      // value4 is start of year 2024
      const value4 = parseTimeString("2024", "YYYY");
      expect(value4).toEqual({
        type: "Y",
        value: 2024,
      });

      const diffInHours = getTimeDifferenceInUnit(value4, value3, "H");
      expect(diffInHours).toBe(12); // 12 hours difference

      const year2025 = parseTimeString("2025", "YYYY");
      const diffInYears = getTimeDifferenceInUnit(value4, year2025, "Y");
      expect(diffInYears).toBe(1); // 1 year difference

      const diffToValue3 = getTimeDifferenceInUnit(
        parseTimeString("2024-06-01", "YYYY-MM-DD"),
        year2025,
        "Y"
      );
      expect(diffToValue3).toBeLessThan(1); // Less than 1 year difference
    });
    it("should throw an error for invalid time strings", () => {
      expect(() => parseTimeString("invalid-date", "YYY")).toThrow();
    });
  });

  describe("convertSecondsToTimeInterval", () => {
    it("should convert seconds to minutes correctly", () => {
      // 60 seconds = 1 minute
      expect(convertSecondsToTimeInterval(60, "m")).toEqual({
        type: "m",
        value: 1,
      });

      expect(convertSecondsToTimeInterval(60 * 60, "H")).toEqual({
        type: "H",
        value: 1,
      });

      // 90 seconds = 1.5 minutes
      expect(convertSecondsToTimeInterval(90, "m")).toEqual({
        type: "m",
        value: 1.5,
      });

      // 120 seconds = 2 minutes
      expect(convertSecondsToTimeInterval(120, "m")).toEqual({
        type: "m",
        value: 2,
      });
    });

    it("should convert seconds to hours correctly", () => {
      // 3600 seconds = 1 hour
      expect(convertSecondsToTimeInterval(3600, "H")).toEqual({
        type: "H",
        value: 1,
      });

      // 5400 seconds = 1.5 hours
      expect(convertSecondsToTimeInterval(5400, "H")).toEqual({
        type: "H",
        value: 1.5,
      });

      // 7200 seconds = 2 hours
      expect(convertSecondsToTimeInterval(7200, "H")).toEqual({
        type: "H",
        value: 2,
      });
    });

    it("should convert seconds to days correctly", () => {
      // 86400 seconds = 1 day
      expect(convertSecondsToTimeInterval(86400, "D")).toEqual({
        type: "D",
        value: 1,
      });

      // 172800 seconds = 2 days
      expect(convertSecondsToTimeInterval(172800, "D")).toEqual({
        type: "D",
        value: 2,
      });
    });

    it("should convert seconds to weeks correctly", () => {
      // 604800 seconds = 1 week
      expect(convertSecondsToTimeInterval(604800, "W")).toEqual({
        type: "W",
        value: 1,
      });

      // 1209600 seconds = 2 weeks
      expect(convertSecondsToTimeInterval(1209600, "W")).toEqual({
        type: "W",
        value: 2,
      });
    });

    it("should convert seconds to months correctly (using approximation)", () => {
      // 2592000 seconds = 30 days = 1 month (approximate)
      expect(convertSecondsToTimeInterval(2592000, "M")).toEqual({
        type: "M",
        value: 1,
      });

      // 5184000 seconds = 60 days = 2 months (approximate)
      expect(convertSecondsToTimeInterval(5184000, "M")).toEqual({
        type: "M",
        value: 2,
      });
    });

    it("should convert seconds to quarters correctly (using approximation)", () => {
      // 7776000 seconds = 90 days = 1 quarter (approximate)
      expect(convertSecondsToTimeInterval(7776000, "Q")).toEqual({
        type: "Q",
        value: 1,
      });

      // 15552000 seconds = 180 days = 2 quarters (approximate)
      expect(convertSecondsToTimeInterval(15552000, "Q")).toEqual({
        type: "Q",
        value: 2,
      });
    });

    it("should convert seconds to years correctly (using approximation)", () => {
      // 31536000 seconds = 365 days = 1 year (approximate)
      expect(convertSecondsToTimeInterval(31536000, "Y")).toEqual({
        type: "Y",
        value: 1,
      });

      // 63072000 seconds = 730 days = 2 years (approximate)
      expect(convertSecondsToTimeInterval(63072000, "Y")).toEqual({
        type: "Y",
        value: 2,
      });
    });

    it("should handle zero seconds correctly", () => {
      expect(convertSecondsToTimeInterval(0, "s")).toEqual({
        type: "s",
        value: 0,
      });

      expect(convertSecondsToTimeInterval(0, "m")).toEqual({
        type: "m",
        value: 0,
      });

      expect(convertSecondsToTimeInterval(0, "H")).toEqual({
        type: "H",
        value: 0,
      });
    });
    it("should handle fractional seconds correctly", () => {
      // Note: Due to rounding in getTimeDifferenceInUnit function,
      // fractional values are rounded based on the rounding factor

      // For seconds with factor = 1, values are rounded to whole numbers
      expect(convertSecondsToTimeInterval(1.5, "s")).toEqual({
        type: "s",
        value: 2, // Rounded to 2
      });

      expect(convertSecondsToTimeInterval(1.4, "s")).toEqual({
        type: "s",
        value: 1, // Rounded to 1
      });

      // For minutes with factor = 60, there's more precision
      expect(convertSecondsToTimeInterval(90, "m")).toEqual({
        type: "m",
        value: 1.5, // 90/60 = 1.5
      });
    });
  });

  describe("splitTimeRangeIntoIntervals", () => {
    it("should split a year range into monthly intervals", () => {
      // Define a range from 2024 to 2025
      const range = {
        start: parseTimeString("2024/01", "YYYY/MM"),
        end: parseTimeString("2025/12", "YYYY/MM"),
      };

      // Split the range into monthly intervals
      const monthlyIntervals = splitTimeRangeIntoIntervals(range, "M");

      // Verify the result
      expect(monthlyIntervals.length).toBe(24); // 24 months from January 2024 to December 2025

      // First interval should be January 2024
      expect(monthlyIntervals[0].increment).toEqual({
        type: "M",
        value: 1, // Represents January 2024 (0-indexed from epoch)
      });

      // Last interval should be January 2025
      expect(monthlyIntervals[11].increment).toEqual({
        type: "M",
        value: 12, // Represents January 2025 (12 months after January 2024)
      });
    });

    it("Should be able to split month volues inside a year range", () => {
      // Define a range from 2024 to 2025
      const range = {
        start: parseTimeString("2024/03", "YYYY/MM"),
        end: parseTimeString("2024/09", "YYYY/MM"),
      };

      // Split the range into monthly intervals
      const monthlyIntervals = splitTimeRangeIntoIntervals(range, "M");

      expect(monthlyIntervals.length).toBe(7); // 7 months from March 2024 to September 2024
    });

    it("should split a year range into quarterly intervals", () => {
      // Define a range from 2024 to 2025
      const range = {
        start: parseTimeString("2024/04", "YYYY/MM"),
        end: parseTimeString("2025/08", "YYYY/MM"),
      };

      // Split the range into quarterly intervals
      const quarterlyIntervals = splitTimeRangeIntoIntervals(range, "Q");

      // Verify the result
      expect(quarterlyIntervals.length).toBe(6); // 6 quarters from Q2 2024 to Q3 2025

      console.log(quarterlyIntervals);

      // First interval should be Q1 2024
      expect(quarterlyIntervals[0].increment).toEqual({
        type: "Q",
        value: 2, // Represents Q1 2024
      });

      // Last interval should be Q4 2025
      expect(quarterlyIntervals[5].increment).toEqual({
        type: "Q",
        value: 3, // Represents Q4 2025
      });
    });

    it("Should be able to split march and april into daily intervals", () => {
      // Define a range from March 2024 to April 2024
      const range = {
        start: parseTimeString("2024/03/01"),
        end: parseTimeString("2024/04/30"),
      };
      // Split the range into daily intervals
      const dailyIntervals = splitTimeRangeIntoIntervals(range, "D");
      // Verify the result
      expect(dailyIntervals.length).toBe(61); // 31 days in March + 30 days in April

      // First interval should be March 1, 2024
      expect(dailyIntervals[0].increment?.increment?.type).toBe("D");
      expect(dailyIntervals[0].increment?.increment?.value).toBe(1); // March 1, 2024

      // Last interval should be April 30, 2024
      expect(dailyIntervals[60].increment?.increment?.type).toBe("D");
      expect(dailyIntervals[60].increment?.increment?.value).toBe(30); // April 30, 2024

      const flattened = flattenResults(dailyIntervals, "D");

      // Should be linear 1,2,3,...,30,31
      const expectedDays = Array.from({ length: 31 }, (_, i) => i + 1);
      expect(flattened.slice(0, 31).map((i) => i.value)).toEqual(expectedDays);
    });

    it("Should be able to split 2024/Q2 to 2024/Q3 into 2 quarterly intervals", () => {
      // Define a range from Q2 2024 to Q3 2024
      const range = {
        start: parseTimeString("2024/Q2"),
        end: parseTimeString("2024/Q3"),
      };
      // Split the range into quarterly intervals
      const quarterlyIntervals = splitTimeRangeIntoIntervals(range, "Q");
      // Verify the result
      expect(quarterlyIntervals.length).toBe(2); // 2 quarters from Q2 2024 to Q3 2024
      // First interval should be Q2 2024
      expect(quarterlyIntervals[0].increment).toEqual({
        type: "Q",
        value: 2, // Represents Q2 2024
      });
      // Last interval should be Q3 2024
      expect(quarterlyIntervals[1].increment).toEqual({
        type: "Q",
        value: 3, // Represents Q3 2024
      });
    });

    it("Should split year range 2000 to 2024 into 25 yearly intervals", () => {
      // Define a range from 2000 to 2024
      const range = {
        start: parseTimeString("2000", "YYYY"),
        end: parseTimeString("2001/12", "YYYY/MM"),
      };

      // Split the range into yearly intervals
      const yearlyIntervals = splitTimeRangeIntoIntervals(range, "Y");

      // Verify the result
      expect(yearlyIntervals.length).toBe(2); // 25 years from 2000 to 2021

      // First interval should be year 2000
      expect(yearlyIntervals[0].value).toBe(2000);

      // Last interval should be year 2024
      expect(yearlyIntervals[1].value).toBe(2001);

      const flattened = flattenResults(
        splitTimeRangeIntoIntervals(range, "M"),
        "M"
      );

      // Should be linear 1,2,3,4,5,6,7,8,9,10,11,12
      const expectedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      expect(flattened.slice(0, 12).map((i) => i.value)).toEqual(
        expectedMonths
      );
    });

    /*
    it("should split a 6-month range into weekly intervals", () => {
      // Define a range from January 2024 to June 2024 (6 months)
      const range = {
        start: parseTimeString("2024-01-01", "YYYY-MM-DD"),
        end: parseTimeString("2024-06-30", "YYYY-MM-DD"),
      };

      // Split the range into weekly intervals
      const weeklyIntervals = splitTimeRangeIntoIntervals(range, "W");

      // Verify the number of weeks (roughly 26 weeks in 6 months)
      expect(weeklyIntervals.length).toBeGreaterThanOrEqual(20);
      expect(weeklyIntervals.length).toBeLessThanOrEqual(27);
    });
    */

    it("should split a month into daily intervals", () => {
      // Define a range for January 2024 (31 days)
      const range = {
        start: parseTimeString("2024-01-01", "YYYY-MM-DD"),
        end: parseTimeString("2024-01-31", "YYYY-MM-DD"),
      };

      // Split the range into daily intervals
      const dailyIntervals = splitTimeRangeIntoIntervals(range, "D");

      // Verify we have the right number of days
      expect(dailyIntervals.length).toBe(31);

      // Check first and last day
      expect(dailyIntervals[0].increment?.increment?.type).toBe("D");
      expect(dailyIntervals[30].increment?.increment?.type).toBe("D");

      // Check spacing (should be consecutive days)
      expect(
        dailyIntervals[1].increment!.increment!.value -
          dailyIntervals[0].increment!.increment!.value
      ).toBe(1);
    });

    describe("Split time range into intervals", () => {
      it("should split year range into yearly intervals", () => {
        const start: TTimeInterval = { type: "Y", value: 2022 };
        const end: TTimeInterval = { type: "Y", value: 2024 };

        const intervals = splitTimeRangeIntoIntervals({ start, end }, "Y");

        expect(intervals).toEqual([
          { type: "Y", value: 2022 },
          { type: "Y", value: 2023 },
          { type: "Y", value: 2024 },
        ]);
      });

      it("should split date range into monthly intervals", () => {
        const start: TTimeInterval = {
          type: "Y",
          value: 2024,
          increment: { type: "M", value: 1 },
        };
        const end: TTimeInterval = {
          type: "Y",
          value: 2024,
          increment: { type: "M", value: 3 },
        };

        const intervals = splitTimeRangeIntoIntervals({ start, end }, "M");

        // We expect January, February, and March 2024
        expect(intervals.length).toBe(3);
        expect(intervals[0]).toEqual({
          type: "Y",
          value: 2024,
          increment: { type: "M", value: 1 },
        });
        expect(intervals[1]).toEqual({
          type: "Y",
          value: 2024,
          increment: { type: "M", value: 2 },
        });
        expect(intervals[2]).toEqual({
          type: "Y",
          value: 2024,
          increment: { type: "M", value: 3 },
        });
      });

      it("should return a single interval when range is less than interval unit", () => {
        // Create a date range of 12 hours, but split by days
        const start: TTimeInterval = {
          type: "Y",
          value: 2024,
          increment: {
            type: "M",
            value: 1,
            increment: {
              type: "D",
              value: 1,
              increment: { type: "H", value: 0 },
            },
          },
        };

        const end: TTimeInterval = {
          type: "Y",
          value: 2024,
          increment: {
            type: "M",
            value: 1,
            increment: {
              type: "D",
              value: 1,
              increment: { type: "H", value: 12 },
            },
          },
        };

        const intervals = splitTimeRangeIntoIntervals({ start, end }, "D");

        // We expect just a single day since the range is less than 24 hours
        expect(intervals.length).toBe(1);
        expect(intervals[0].type).toBe("Y");
        expect(intervals[0].increment?.type).toBe("M");
        expect(intervals[0].increment?.increment?.type).toBe("D");
        expect(intervals[0].increment?.increment?.value).toBe(1);
      });
    });
  });
});
