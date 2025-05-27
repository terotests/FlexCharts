import { describe, it, expect } from "vitest";
import { isTimeInRange, parseTimeString } from "../time";

describe("isTimeInRange", () => {
  it("should correctly identify a time within a year range", () => {
    const range = {
      start: parseTimeString("2023", "YYYY"),
      end: parseTimeString("2025", "YYYY"),
    };

    // Within range
    const within = parseTimeString("2024", "YYYY");
    expect(isTimeInRange({ time: within, range })).toBe(true);

    // At start boundary
    const atStart = parseTimeString("2023", "YYYY");
    expect(isTimeInRange({ time: atStart, range })).toBe(true);

    // At end boundary
    const atEnd = parseTimeString("2025", "YYYY");
    expect(isTimeInRange({ time: atEnd, range })).toBe(true);

    // Outside range (before)
    const before = parseTimeString("2022", "YYYY");
    expect(isTimeInRange({ time: before, range })).toBe(false);

    // Outside range (after)
    const after = parseTimeString("2026", "YYYY");
    expect(isTimeInRange({ time: after, range })).toBe(false);
  });

  it("should handle date ranges with different precision", () => {
    // Range spanning from January 2024 to June 2024
    const range = {
      start: parseTimeString("2024-01", "YYYY-MM"),
      end: parseTimeString("2024-06", "YYYY-MM"),
    };

    // Month within range
    const march = parseTimeString("2024-03", "YYYY-MM");
    expect(isTimeInRange({ time: march, range })).toBe(true);

    // Specific date within range
    const specificDate = parseTimeString("2024-02-15", "YYYY-MM-DD");
    expect(isTimeInRange({ time: specificDate, range })).toBe(true);

    // Date outside range
    const july = parseTimeString("2024-07", "YYYY-MM");
    expect(isTimeInRange({ time: july, range })).toBe(false);

    // Year only (should be in range as it's interpreted as start of 2024)
    const yearOnly = parseTimeString("2024", "YYYY");
    expect(isTimeInRange({ time: yearOnly, range })).toBe(true);
  });

  it("should handle time ranges with hours, minutes and seconds", () => {
    // Range from 10:00 to 14:00 on the same day
    const range = {
      start: parseTimeString("2024-05-01T10:00:00", "YYYY-MM-DDTHH:mm:ss"),
      end: parseTimeString("2024-05-01T14:00:00", "YYYY-MM-DDTHH:mm:ss"),
    };

    // Time within range
    const noon = parseTimeString("2024-05-01T12:30:00", "YYYY-MM-DDTHH:mm:ss");
    expect(isTimeInRange({ time: noon, range })).toBe(true);

    // Time at start boundary
    const atStart = parseTimeString(
      "2024-05-01T10:00:00",
      "YYYY-MM-DDTHH:mm:ss"
    );
    expect(isTimeInRange({ time: atStart, range })).toBe(true);

    // Time outside range (before)
    const before = parseTimeString(
      "2024-05-01T09:59:59",
      "YYYY-MM-DDTHH:mm:ss"
    );
    expect(isTimeInRange({ time: before, range })).toBe(false);

    // Time outside range (after)
    const after = parseTimeString("2024-05-01T14:00:01", "YYYY-MM-DDTHH:mm:ss");
    expect(isTimeInRange({ time: after, range })).toBe(false);
  });

  it("should handle quarter ranges correctly", () => {
    // Range from Q1 2024 to Q3 2024
    const range = {
      start: parseTimeString("2024/1", "YYYY/Q"),
      end: parseTimeString("2024/3", "YYYY/Q"),
    };

    // Q2 should be within range
    const q2 = parseTimeString("2024/2", "YYYY/Q");
    expect(isTimeInRange({ time: q2, range })).toBe(true);

    // Q4 should be outside range
    const q4 = parseTimeString("2024/4", "YYYY/Q");
    expect(isTimeInRange({ time: q4, range })).toBe(false);

    // Date in Q2 should be within range
    const dateInQ2 = parseTimeString("2024-05-15", "YYYY-MM-DD");
    expect(isTimeInRange({ time: dateInQ2, range })).toBe(true);

    // Date in Q4 should be outside range
    const dateInQ4 = parseTimeString("2024-11-15", "YYYY-MM-DD");
    expect(isTimeInRange({ time: dateInQ4, range })).toBe(false);
  });

  it("should handle reverse ranges (where start > end)", () => {
    // Range from 2025 to 2023 (reverse)
    const reverseRange = {
      start: parseTimeString("2025", "YYYY"),
      end: parseTimeString("2023", "YYYY"),
    };

    // 2024 is in the middle, but since the range is reversed, it should return false
    const middle = parseTimeString("2024", "YYYY");
    expect(isTimeInRange({ time: middle, range: reverseRange })).toBe(false);
  });

  it("should handle week ranges", () => {
    // Define a range from week 10 to week 20 of 2024
    const week10 = parseTimeString("2024-W10", "YYYY-'W'WW");
    const week20 = parseTimeString("2024-W20", "YYYY-'W'WW");
    const range = { start: week10, end: week20 };

    // Week 15 should be within range
    const week15 = parseTimeString("2024-W15", "YYYY-'W'WW");
    expect(isTimeInRange({ time: week15, range })).toBe(true);

    // Week 5 should be outside range
    const week5 = parseTimeString("2024-W05", "YYYY-'W'WW");
    expect(isTimeInRange({ time: week5, range })).toBe(false);

    // Week 25 should be outside range
    const week25 = parseTimeString("2024-W25", "YYYY-'W'WW");
    expect(isTimeInRange({ time: week25, range })).toBe(false);
  });

  it("should handle empty or single-point ranges", () => {
    // Single-point range (start = end)
    const pointRange = {
      start: parseTimeString("2024-01-01", "YYYY-MM-DD"),
      end: parseTimeString("2024-01-01", "YYYY-MM-DD"),
    };

    // Same point should be in range
    const samePoint = parseTimeString("2024-01-01", "YYYY-MM-DD");
    expect(isTimeInRange({ time: samePoint, range: pointRange })).toBe(true);

    // Different point should not be in range
    const differentPoint = parseTimeString("2024-01-02", "YYYY-MM-DD");
    expect(isTimeInRange({ time: differentPoint, range: pointRange })).toBe(
      false
    );
  });
});
