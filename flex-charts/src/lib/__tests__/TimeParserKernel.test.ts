import { describe, it, expect } from "vitest";
import {
  parseTimeString,
  type TTimeParserKernel,
  getTimeDifferenceInUnit,
  getTimeDifferenceInSeconds,
} from "../time";

describe("TTimeParserKernel with multiple time patterns", () => {
  it("should parse a time string using a kernel with multiple patterns", () => {
    // Define a kernel with multiple date formats
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

    // Test with various date formats
    const date1 = parseTimeString("2023-05-15", dateFormatsKernel);
    const date2 = parseTimeString("2023/05/15", dateFormatsKernel);
    const date3 = parseTimeString("05/15/2023", dateFormatsKernel);
    const date4 = parseTimeString("15-05-2023", dateFormatsKernel);

    // All should parse to the same date
    expect(getTimeDifferenceInSeconds(date1, date2)).toBe(0);
    expect(getTimeDifferenceInSeconds(date1, date3)).toBe(0);

    expect(getTimeDifferenceInSeconds(date1, date4)).toBe(0);

    // Test with a partial date format (year-month only)
    const date5 = parseTimeString("2023-05", dateFormatsKernel);
    const date6 = parseTimeString("05/2023", dateFormatsKernel);

    // These should be equivalent
    expect(getTimeDifferenceInSeconds(date5, date6)).toBe(0);

    // But different from the full dates
    expect(getTimeDifferenceInUnit(date1, date5, "D")).toBe(-14); // First day vs 15th
  });

  it("should parse time strings with different separators", () => {
    const timeFormatsKernel: TTimeParserKernel = {
      patterns: ["HH:mm:ss", "HH.mm.ss", "HH-mm-ss", "HH:mm", "HH.mm"],
    };

    const time1 = parseTimeString("14:30:45", timeFormatsKernel);
    const time2 = parseTimeString("14.30.45", timeFormatsKernel);
    const time3 = parseTimeString("14-30-45", timeFormatsKernel);

    // All should parse to the same time
    expect(getTimeDifferenceInSeconds(time1, time2)).toBe(0);
    expect(getTimeDifferenceInSeconds(time1, time3)).toBe(0);

    // Test with partial time format (hours:minutes only)
    const time4 = parseTimeString("14:30", timeFormatsKernel);
    const time5 = parseTimeString("14.30", timeFormatsKernel);

    // These should be equivalent
    expect(getTimeDifferenceInSeconds(time4, time5)).toBe(0);

    // But different from the full times
    expect(getTimeDifferenceInUnit(time1, time4, "s")).toBe(-45); // No seconds in time4
  });

  it("should handle mixed date and time patterns", () => {
    const mixedFormatsKernel: TTimeParserKernel = {
      patterns: [
        "YYYY-MM-DDTHH:mm:ss",
        "YYYY-MM-DD HH:mm:ss",
        "MM/DD/YYYY HH:mm",
        "YYYY-MM-DD",
      ],
    };

    const datetime1 = parseTimeString(
      "2023-05-15T14:30:45",
      mixedFormatsKernel
    );
    const datetime2 = parseTimeString(
      "2023-05-15 14:30:45",
      mixedFormatsKernel
    );
    const datetime3 = parseTimeString("05/15/2023 14:30", mixedFormatsKernel);

    // First two should be identical
    expect(getTimeDifferenceInSeconds(datetime1, datetime2)).toBe(0);

    // Third one differs by 45 seconds
    expect(getTimeDifferenceInUnit(datetime1, datetime3, "s")).toBe(-45);

    // Test with date only
    const datetime4 = parseTimeString("2023-05-15", mixedFormatsKernel);

    // Difference should be the hours, minutes, seconds
    expect(getTimeDifferenceInUnit(datetime1, datetime4, "H")).toBe(-14.5);
  });

  it("should handle quarters in different formats", () => {
    const quarterFormatsKernel: TTimeParserKernel = {
      patterns: ["YYYY/Q", "YYYY-Q", "'Q'Q/YYYY", "YYYY'Q'Q"],
    };

    const q1 = parseTimeString("2023/2", quarterFormatsKernel); // Q2 2023
    const q2 = parseTimeString("2023-2", quarterFormatsKernel); // Q2 2023
    const q3 = parseTimeString("Q2/2023", quarterFormatsKernel); // Q2 2023
    const q4 = parseTimeString("2023Q2", quarterFormatsKernel); // Q2 2023

    // All should parse to the same quarter
    expect(getTimeDifferenceInSeconds(q1, q2)).toBe(0);
    expect(getTimeDifferenceInSeconds(q1, q3)).toBe(0);
    expect(getTimeDifferenceInSeconds(q1, q4)).toBe(0);

    // Test difference between quarters
    const q5 = parseTimeString("2023/4", quarterFormatsKernel); // Q4 2023
    expect(getTimeDifferenceInUnit(q1, q5, "Q")).toBe(2); // 2 quarters difference
    expect(getTimeDifferenceInUnit(q1, q5, "Y")).toBe(0.5); // Half a year difference
  });

  it("should provide fallback for unmatched formats", () => {
    // Define a kernel with formats that won't match our string
    const noMatchKernel: TTimeParserKernel = {
      patterns: ["YYYY-MM-DD", "HH:mm:ss"],
    };

    // This should throw an error as none of the patterns match
    expect(() => parseTimeString("invalid-format", noMatchKernel)).toThrow();

    // Mix of valid and invalid patterns
    const mixedValidityKernel: TTimeParserKernel = {
      patterns: [
        "invalid-pattern",
        "YYYY-MM-DD", // This one will match
        "another-invalid",
      ],
    };

    // Should parse correctly using the valid pattern
    const date = parseTimeString("2023-05-15", mixedValidityKernel);
    expect(date).toEqual({
      type: "Y",
      value: 2023,
      increment: {
        type: "M",
        value: 5,
        increment: {
          type: "D",
          value: 15,
        },
      },
    });
  });
});
