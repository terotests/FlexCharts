import { describe, it, expect } from "vitest";
import { parseTimeString } from "../time";

describe("defaultTimeParserKernel", () => {
  describe("Date formats", () => {
    it("should parse ISO date format YYYY-MM-DD", () => {
      const result = parseTimeString("2025-01-15");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 1,
          increment: {
            type: "D",
            value: 15,
          },
        },
      });
    });

    it("should parse slash-separated date format YYYY/MM/DD", () => {
      const result = parseTimeString("2025/02/20");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 2,
          increment: {
            type: "D",
            value: 20,
          },
        },
      });
    });

    it("should parse US date format MM/DD/YYYY", () => {
      const result = parseTimeString("03/25/2025");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 3,
          increment: {
            type: "D",
            value: 25,
          },
        },
      });
    });

    it("should parse European date format DD.MM.YYYY", () => {
      const result = parseTimeString("05.04.2025");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 4,
          increment: {
            type: "D",
            value: 5,
          },
        },
      });
    });

    it("should parse European date format DD-MM-YYYY", () => {
      const result = parseTimeString("06-07-2025");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 7,
          increment: {
            type: "D",
            value: 6,
          },
        },
      });
    });
  });

  describe("Year and month formats", () => {
    it("should parse year-month format YYYY-MM", () => {
      const result = parseTimeString("2025-08");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 8,
        },
      });
    });

    it("should parse month/year format MM/YYYY", () => {
      const result = parseTimeString("09/2025");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 9,
        },
      });
    });
  });

  describe("Quarter formats", () => {
    it("should parse quarter format 'Q'Q/YYYY", () => {
      const result = parseTimeString("Q2/2025");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "Q",
          value: 2,
        },
      });
    });

    it("should parse year/quarter format YYYY/'Q'Q", () => {
      const result = parseTimeString("2025/Q3");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "Q",
          value: 3,
        },
      });
    });

    it("should parse quarter format YYYY'Q'Q", () => {
      const result = parseTimeString("2025Q1");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "Q",
          value: 1,
        },
      });
    });

    it("should parse year/month format YYYY/M", () => {
      const result = parseTimeString("2025/5");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 5,
        },
      });
    });

    it("should parse month/year format M/YYYY", () => {
      const result = parseTimeString("6/2025");
      expect(result).toEqual({
        type: "Y",
        value: 2025,
        increment: {
          type: "M",
          value: 6,
        },
      });
    });
  });

  describe("Time formats", () => {
    it("should parse time format HH:mm:ss", () => {
      const result = parseTimeString("14:30:45");
      expect(result).toEqual({
        type: "H",
        value: 14,
        increment: {
          type: "m",
          value: 30,
          increment: {
            type: "s",
            value: 45,
          },
        },
      });
    });

    it("should parse time format HH:mm", () => {
      const result = parseTimeString("15:25");
      expect(result).toEqual({
        type: "H",
        value: 15,
        increment: {
          type: "m",
          value: 25,
        },
      });
    });

    it("should parse time format with single digits H:mm:s", () => {
      const result = parseTimeString("9:05:3");
      expect(result).toEqual({
        type: "H",
        value: 9,
        increment: {
          type: "m",
          value: 5,
          increment: {
            type: "s",
            value: 3,
          },
        },
      });
    });
  });

  describe("Duration formats", () => {
    it("should parse duration format 'Y years'", () => {
      const result = parseTimeString("3 years");
      expect(result).toEqual({
        type: "Y",
        value: 3,
      });
    });

    it("should parse duration format 'Y year'", () => {
      const result = parseTimeString("1 year");
      expect(result).toEqual({
        type: "Y",
        value: 1,
      });
    });

    it("should parse duration format 'Q quarters'", () => {
      const result = parseTimeString("2 quarters");
      expect(result).toEqual({
        type: "Q",
        value: 2,
      });
    });

    it("should parse duration format 'Q quarter'", () => {
      const result = parseTimeString("1 quarter");
      expect(result).toEqual({
        type: "Q",
        value: 1,
      });
    });

    it("should parse duration format 'M months'", () => {
      const result = parseTimeString("6 months");
      expect(result).toEqual({
        type: "M",
        value: 6,
      });
    });

    it("should parse duration format 'M month'", () => {
      const result = parseTimeString("1 month");
      expect(result).toEqual({
        type: "M",
        value: 1,
      });
    });

    it("should parse duration format 'W weeks'", () => {
      const result = parseTimeString("4 weeks");
      expect(result).toEqual({
        type: "W",
        value: 4,
      });
    });

    it("should parse duration format 'D days'", () => {
      const result = parseTimeString("5 days");
      expect(result).toEqual({
        type: "D",
        value: 5,
      });
    });

    it("should parse duration format 'D day'", () => {
      const result = parseTimeString("1 day");
      expect(result).toEqual({
        type: "D",
        value: 1,
      });
    });

    it("should parse duration format 'H hours'", () => {
      const result = parseTimeString("12 hours");
      expect(result).toEqual({
        type: "H",
        value: 12,
      });
    });

    it("should parse duration format 'H hour'", () => {
      const result = parseTimeString("1 hour");
      expect(result).toEqual({
        type: "H",
        value: 1,
      });
    });

    it("should parse duration format 'm minutes'", () => {
      const result = parseTimeString("45 minutes");
      expect(result).toEqual({
        type: "m",
        value: 45,
      });
    });

    it("should parse duration format 'm minute'", () => {
      const result = parseTimeString("1 minute");
      expect(result).toEqual({
        type: "m",
        value: 1,
      });
    });

    it("should parse duration format 's seconds'", () => {
      const result = parseTimeString("30 seconds");
      expect(result).toEqual({
        type: "s",
        value: 30,
      });
    });

    /*
    it("should parse duration format 's second'", () => {
      const result = parseTimeString("1 second");
      expect(result).toEqual({
        type: "s",
        value: 1,
      });
    });
    */
  });

  describe("Error handling", () => {
    it("should throw an error for invalid time string format", () => {
      expect(() => parseTimeString("invalid-time")).toThrow();
    });
  });

  describe("Mixed format detection", () => {
    it("should detect the correct format from various valid inputs", () => {
      // These should all result in the same time (March 15, 2025)
      const formats = [
        "2025-03-15",
        "2025/03/15",
        "03/15/2025",
        "15.03.2025",
        "15-03-2025",
      ];

      const results = formats.map((format) => parseTimeString(format));

      // All results should be equal
      const firstResult = results[0];
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toEqual(firstResult);
      }
    });
  });
});
