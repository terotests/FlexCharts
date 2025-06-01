/**
 * Unit tests for TimeInterval utility class
 */

import { describe, it, expect, beforeEach } from "vitest";
import { TimeInterval, TimeSpan, Time } from "../TimeInterval";
import type { TTimeInterval, TTimeIntervalType } from "../time";

describe("TimeInterval", () => {
  describe("difference calculations", () => {
    it("should calculate difference in seconds", () => {
      const start = TimeInterval.from("2024-01-01");
      const end = TimeInterval.from("2024-01-02");
      const diff = start.diffInSeconds(end);
      expect(diff).toBe(24 * 60 * 60); // 1 day in seconds
    });

    it("should calculate difference in specified unit", () => {
      const start = TimeInterval.from("2024-01-01");
      const end = TimeInterval.from("2024-02-01");
      const diffInDays = start.diffInUnit(end, "D");
      expect(diffInDays).toBe(31); // January has 31 days
    });

    it("should calculate difference in years", () => {
      const start = TimeInterval.from("2020");
      const end = TimeInterval.from("2024");
      const diffInYears = start.diffInUnit(end, "Y");
      expect(diffInYears).toBe(4);
    });
  });

  describe("comparison methods", () => {
    let timeInterval1: TimeInterval;
    let timeInterval2: TimeInterval;
    let timeInterval3: TimeInterval;

    beforeEach(() => {
      timeInterval1 = TimeInterval.from("2024-01-01");
      timeInterval2 = TimeInterval.from("2024-06-01");
      timeInterval3 = TimeInterval.from("2024-01-01");
    });

    it("should compare TimeIntervals correctly", () => {
      expect(timeInterval1.compare(timeInterval2)).toBe(-1); // Before
      expect(timeInterval2.compare(timeInterval1)).toBe(1); // After
      expect(timeInterval1.compare(timeInterval3)).toBe(0); // Equal
    });

    it("should check if before another TimeInterval", () => {
      expect(timeInterval1.isBefore(timeInterval2)).toBe(true);
      expect(timeInterval2.isBefore(timeInterval1)).toBe(false);
      expect(timeInterval1.isBefore(timeInterval3)).toBe(false);
    });

    it("should check if after another TimeInterval", () => {
      expect(timeInterval2.isAfter(timeInterval1)).toBe(true);
      expect(timeInterval1.isAfter(timeInterval2)).toBe(false);
      expect(timeInterval1.isAfter(timeInterval3)).toBe(false);
    });

    it("should check if same as another TimeInterval", () => {
      expect(timeInterval1.isSame(timeInterval3)).toBe(true);
      expect(timeInterval1.isSame(timeInterval2)).toBe(false);
    });

    it("should check equality", () => {
      expect(timeInterval1.equals(timeInterval3)).toBe(true);
      expect(timeInterval1.equals(timeInterval2)).toBe(false);
    });
  });

  describe("immutable operations", () => {
    let original: TimeInterval;

    beforeEach(() => {
      original = TimeInterval.from("2024-03-15");
    });

    it("should create new instance with different value", () => {
      const modified = original.withValue(2025);
      expect(modified.value).toBe(2025);
      expect(original.value).toBe(2024); // Original unchanged
    });

    it("should create new instance with different type", () => {
      const modified = original.withType("M");
      expect(modified.type).toBe("M");
      expect(original.type).toBe("Y"); // Original unchanged
    });

    it("should create new instance with increment", () => {
      const increment = TimeInterval.from("Q2", "'Q'Q");
      const modified = original.withIncrement(increment);
      expect(modified.increment).not.toBeNull();
      expect(modified.increment!.type).toBe("Q");
      expect(original.increment).toBeDefined(); // Original may have increment
    });

    it("should clone TimeInterval", () => {
      const cloned = original.clone();
      expect(cloned.equals(original)).toBe(true);
      expect(cloned).not.toBe(original); // Different instances
    });
  });

  describe("range operations", () => {
    it("should check if TimeInterval is in range", () => {
      const timeInterval = TimeInterval.from("2024-06-15");
      const start = TimeInterval.from("2024-01-01");
      const end = TimeInterval.from("2024-12-31");

      expect(timeInterval.isInRange({ start, end })).toBe(true);
    });

    it("should check if TimeInterval is outside range", () => {
      const timeInterval = TimeInterval.from("2025-06-15");
      const start = TimeInterval.from("2024-01-01");
      const end = TimeInterval.from("2024-12-31");

      expect(timeInterval.isInRange({ start, end })).toBe(false);
    });

    it("should calculate position in span", () => {
      const timeInterval = TimeInterval.from("2024-06-15");
      const span = new TimeSpan(
        TimeInterval.from("2024-01-01"),
        TimeInterval.from("2024-12-31")
      );

      const position = timeInterval.positionInSpan(span);
      expect(position).toBeGreaterThan(0);
      expect(position).toBeLessThan(1);
      expect(position).toBeCloseTo(0.45, 1); // Approximately mid-year
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle invalid time strings gracefully", () => {
      expect(() => Time.parse("invalid-date")).toThrow();
    });

    it("should handle negative values", () => {
      const interval: TTimeInterval = { type: "Y", value: -1 };
      expect(() => new TimeInterval(interval).toSeconds()).toThrow();
    });

    it("should handle very large date ranges", () => {
      const span = Time.span("1000", "3000");
      const duration = span.durationInUnit("Y");
      expect(duration).toBe(2000);
    });

    it("should handle same start and end dates", () => {
      const span = Time.span("2024-01-01", "2024-01-01");
      const duration = span.durationInSeconds;
      expect(duration).toBe(0);
    });

    it("should handle end date before start date", () => {
      const span = Time.span("2024-12-31", "2024-01-01");
      const duration = span.durationInSeconds;
      expect(duration).toBeLessThan(0);
    });
  });

  describe("complex time operations", () => {
    it("should handle chained operations", () => {
      const result = Time.parse("2024")
        .withIncrement(Time.parse("Q2", "'Q'Q"))
        .withValue(2025);

      expect(result.value).toBe(2025);
      expect(result.increment?.type).toBe("Q");
      expect(result.increment?.value).toBe(2);
    });

    it("should handle nested increments", () => {
      const interval: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 6,
          increment: {
            type: "D",
            value: 15,
          },
        },
      };
      const timeInterval = new TimeInterval(interval);

      expect(timeInterval.increment?.increment?.type).toBe("D");
      expect(timeInterval.increment?.increment?.value).toBe(15);
    });

    it("should handle multiple time interval types", () => {
      const timeTypes: TTimeIntervalType[] = [
        "Y",
        "M",
        "Q",
        "W",
        "D",
        "H",
        "m",
        "s",
      ];

      timeTypes.forEach((type) => {
        const interval: TTimeInterval = { type, value: 1 };
        const timeInterval = new TimeInterval(interval);
        expect(timeInterval.type).toBe(type);
        expect(timeInterval.value).toBe(1);
      });
    });
  });
});

describe("TimeSpan", () => {
  describe("constructor and basic properties", () => {
    it("should create TimeSpan from TimeIntervals", () => {
      const start = TimeInterval.from("2024-01-01");
      const end = TimeInterval.from("2024-12-31");
      const span = new TimeSpan(start, end);

      expect(span.start.equals(start)).toBe(true);
      expect(span.end.equals(end)).toBe(true);
    });

    it("should create TimeSpan from strings", () => {
      const span = TimeSpan.from("2024-01-01", "2024-12-31");
      expect(span.start.value).toBe(2024);
      expect(span.end.value).toBe(2024);
    });

    it("should return raw TTimeSpan object", () => {
      const span = TimeSpan.from("2024-01-01", "2024-12-31");
      const raw = span.raw;

      expect(raw.start).toBeDefined();
      expect(raw.end).toBeDefined();
      expect(raw.start.type).toBe("Y");
      expect(raw.end.type).toBe("Y");
    });
  });

  describe("duration calculations", () => {
    it("should calculate duration in seconds", () => {
      const span = TimeSpan.from("2024-01-01", "2024-01-02");
      const duration = span.durationInSeconds;
      expect(duration).toBe(24 * 60 * 60); // 1 day
    });

    it("should calculate duration in specified unit", () => {
      const span = TimeSpan.from("2024-01-01", "2024-02-01");
      const durationInDays = span.durationInUnit("D");
      expect(durationInDays).toBe(31); // January has 31 days
    });

    it("should calculate duration in years", () => {
      const span = TimeSpan.from("2020", "2024");
      const durationInYears = span.durationInUnit("Y");
      expect(durationInYears).toBe(4);
    });
  });

  describe("span operations", () => {
    let span: TimeSpan;

    beforeEach(() => {
      span = TimeSpan.from("2024-01-01", "2024-12-31");
    });

    it("should split span into intervals", () => {
      const quarters = span.splitInto("Q");
      expect(quarters).toHaveLength(4);
      expect(quarters[0].increment?.type).toBe("Q");
      expect(quarters[0].increment?.value).toBe(1);
    });

    it("should split span into months", () => {
      const months = span.splitInto("M");
      expect(months).toHaveLength(12);
      expect(months[0].increment?.type).toBe("M");
      expect(months[0].increment?.value).toBe(1);
    });

    it("should calculate position of TimeInterval within span", () => {
      const midYear = TimeInterval.from("2024-06-15");
      const position = span.positionOf(midYear);
      expect(position).toBeGreaterThan(0.4);
      expect(position).toBeLessThan(0.6);
    });

    it("should check if span contains TimeInterval", () => {
      const withinSpan = TimeInterval.from("2024-06-15");
      const outsideSpan = TimeInterval.from("2025-06-15");

      expect(span.contains(withinSpan)).toBe(true);
      expect(span.contains(outsideSpan)).toBe(false);
    });

    it("should create new span with different start", () => {
      const newStart = TimeInterval.from("2023-01-01");
      const newSpan = span.withStart(newStart);

      expect(newSpan.start.equals(newStart)).toBe(true);
      expect(newSpan.end.equals(span.end)).toBe(true);
      expect(span.start.value).toBe(2024); // Original unchanged
    });

    it("should create new span with different end", () => {
      const newEnd = TimeInterval.from("2025-12-31");
      const newSpan = span.withEnd(newEnd);

      expect(newSpan.start.equals(span.start)).toBe(true);
      expect(newSpan.end.equals(newEnd)).toBe(true);
      expect(span.end.value).toBe(2024); // Original unchanged
    });

    it("should clone TimeSpan", () => {
      const cloned = span.clone();
      expect(cloned.start.equals(span.start)).toBe(true);
      expect(cloned.end.equals(span.end)).toBe(true);
      expect(cloned).not.toBe(span); // Different instances
    });

    it("should convert to JSON", () => {
      const json = span.toJSON();
      expect(json.start).toBeDefined();
      expect(json.end).toBeDefined();
    });
  });
});

describe("Time utility functions", () => {
  describe("parse function", () => {
    it("should parse time strings", () => {
      const timeInterval = Time.parse("2024-03-15");
      expect(timeInterval.type).toBe("Y");
      expect(timeInterval.value).toBe(2024);
    });

    it("should parse with custom format", () => {
      const timeInterval = Time.parse("Q2", "'Q'Q");
      expect(timeInterval.type).toBe("Q");
      expect(timeInterval.value).toBe(2);
    });
  });

  describe("fromDate function", () => {
    it("should create TimeInterval from Date", () => {
      const date = new Date("2024-06-15");
      const timeInterval = Time.fromDate(date, "Y");
      expect(timeInterval.type).toBe("Y");
      expect(timeInterval.value).toBe(2024);
    });
  });

  describe("now function", () => {
    it("should create TimeInterval for current time", () => {
      const timeInterval = Time.now("Y");
      expect(timeInterval.type).toBe("Y");
      expect(timeInterval.value).toBeGreaterThan(2020);
    });

    it("should create TimeInterval with default accuracy", () => {
      const timeInterval = Time.now();
      expect(timeInterval.type).toBe("Y");
    });
  });

  describe("fromSeconds function", () => {
    it("should create TimeInterval from seconds", () => {
      const timeInterval = Time.fromSeconds(3600, "H");
      expect(timeInterval.type).toBe("H");
      expect(timeInterval.value).toBe(1);
    });
  });

  describe("span function", () => {
    it("should create TimeSpan from strings", () => {
      const span = Time.span("2024-01-01", "2024-12-31");
      expect(span.start.value).toBe(2024);
      expect(span.end.value).toBe(2024);
    });
  });

  describe("spanFrom function", () => {
    it("should create TimeSpan from TimeIntervals", () => {
      const start = Time.parse("2024-01-01");
      const end = Time.parse("2024-12-31");
      const span = Time.spanFrom(start, end);

      expect(span.start.equals(start)).toBe(true);
      expect(span.end.equals(end)).toBe(true);
    });
  });
});

describe("edge cases and error handling", () => {
  it("should handle invalid time strings gracefully", () => {
    expect(() => Time.parse("invalid-date")).toThrow();
  });

  it("should handle negative values", () => {
    const interval: TTimeInterval = { type: "Y", value: -1 };
    expect(() => new TimeInterval(interval).toSeconds()).toThrow();
  });

  it("should handle very large date ranges", () => {
    const span = Time.span("1000", "3000");
    const duration = span.durationInUnit("Y");
    expect(duration).toBe(2000);
  });

  it("should handle same start and end dates", () => {
    const span = Time.span("2024-01-01", "2024-01-01");
    const duration = span.durationInSeconds;
    expect(duration).toBe(0);
  });

  it("should handle end date before start date", () => {
    const span = Time.span("2024-12-31", "2024-01-01");
    const duration = span.durationInSeconds;
    expect(duration).toBeLessThan(0);
  });
});

describe("complex time operations", () => {
  it("should handle chained operations", () => {
    const result = Time.parse("2024")
      .withIncrement(Time.parse("Q2", "'Q'Q"))
      .withValue(2025);

    expect(result.value).toBe(2025);
    expect(result.increment?.type).toBe("Q");
    expect(result.increment?.value).toBe(2);
  });

  it("should handle nested increments", () => {
    const interval: TTimeInterval = {
      type: "Y",
      value: 2024,
      increment: {
        type: "M",
        value: 6,
        increment: {
          type: "D",
          value: 15,
        },
      },
    };
    const timeInterval = new TimeInterval(interval);

    expect(timeInterval.increment?.increment?.type).toBe("D");
    expect(timeInterval.increment?.increment?.value).toBe(15);
  });

  it("should handle multiple time interval types", () => {
    const timeTypes: TTimeIntervalType[] = [
      "Y",
      "M",
      "Q",
      "W",
      "D",
      "H",
      "m",
      "s",
    ];

    timeTypes.forEach((type) => {
      const interval: TTimeInterval = { type, value: 1 };
      const timeInterval = new TimeInterval(interval);
      expect(timeInterval.type).toBe(type);
      expect(timeInterval.value).toBe(1);
    });
  });
});
