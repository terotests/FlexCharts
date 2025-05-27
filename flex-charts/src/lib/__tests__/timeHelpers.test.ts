import { describe, it, expect } from "vitest";
import {
  getDayNumber,
  getMonthNumber,
  getQuarterNumber,
  type TTimeInterval,
} from "../time";

describe("Time Helper Functions", () => {
  describe("getDayNumber", () => {
    it("should return day number from time interval with Y-M-D structure", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 5,
          increment: {
            type: "D",
            value: 15,
          },
        },
      };

      expect(getDayNumber(time)).toBe(15);
    });

    it("should return default 1 when day is not specified", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 5,
        },
      };

      expect(getDayNumber(time)).toBe(1);
    });

    it("should return default 1 for time intervals without M-D structure", () => {
      const time: TTimeInterval = {
        type: "Q",
        value: 2,
      };

      expect(getDayNumber(time)).toBe(1);
    });
  });

  describe("getMonthNumber", () => {
    it("should return month number from Y-M structure", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 7,
        },
      };

      expect(getMonthNumber(time)).toBe(7);
    });

    it("should return month value directly for M type", () => {
      const time: TTimeInterval = {
        type: "M",
        value: 9,
      };

      expect(getMonthNumber(time)).toBe(9);
    });

    it("should calculate month from quarter", () => {
      // Q1 should return January (1)
      const q1: TTimeInterval = {
        type: "Q",
        value: 1,
      };
      expect(getMonthNumber(q1)).toBe(1); // Jan for Q1

      // Q2 should return April (4)
      const q2: TTimeInterval = {
        type: "Q",
        value: 2,
      };
      expect(getMonthNumber(q2)).toBe(4); // Apr for Q2

      // Q3 should return July (7)
      const q3: TTimeInterval = {
        type: "Q",
        value: 3,
      };
      expect(getMonthNumber(q3)).toBe(7); // Jul for Q3

      // Q4 should return October (10)
      const q4: TTimeInterval = {
        type: "Q",
        value: 4,
      };
      expect(getMonthNumber(q4)).toBe(10); // Oct for Q4
    });

    it("should approximate month from weeks", () => {
      const week5: TTimeInterval = {
        type: "W",
        value: 5,
      };

      // Expects approximately month 2 (February) for week 5
      expect(getMonthNumber(week5)).toBe(2);
    });

    it("should approximate month from days", () => {
      const day15: TTimeInterval = {
        type: "D",
        value: 15,
      };

      // Expects month 1 (January) for day 15
      expect(getMonthNumber(day15)).toBe(1);

      const day45: TTimeInterval = {
        type: "D",
        value: 45,
      };

      // Expects month 2 (February) for day 45
      expect(getMonthNumber(day45)).toBe(2);

      const day120: TTimeInterval = {
        type: "D",
        value: 120,
      };

      // Expects month 4 (April) for day 120
      expect(getMonthNumber(day120)).toBe(4);
    });

    it("should return default 1 (January) for other types", () => {
      const time: TTimeInterval = {
        type: "H",
        value: 12,
      };

      expect(getMonthNumber(time)).toBe(1);
    });
  });

  describe("getQuarterNumber", () => {
    it("should get quarter from increment", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "Q",
          value: 3,
        },
      };

      expect(getQuarterNumber(time)).toBe(3);
    });

    it("should calculate quarter from months", () => {
      // Test month 2 (February) -> Q1
      const m2: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 2,
        },
      };
      expect(getQuarterNumber(m2)).toBe(1);

      // Test month 5 (May) -> Q2
      const m5: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 5,
        },
      };
      expect(getQuarterNumber(m5)).toBe(2);

      // Test month 7 (July) -> Q3
      const m7: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 7,
        },
      };
      expect(getQuarterNumber(m7)).toBe(3);

      // Test month 11 (November) -> Q4
      const m11: TTimeInterval = {
        type: "Y",
        value: 2024,
        increment: {
          type: "M",
          value: 11,
        },
      };
      expect(getQuarterNumber(m11)).toBe(4);
    });

    it("should return quarter value directly for Q type", () => {
      const q2: TTimeInterval = {
        type: "Q",
        value: 2,
      };

      expect(getQuarterNumber(q2)).toBe(2);
    });

    it("should calculate quarter from weeks", () => {
      // Week 10 should be Q1
      const w10: TTimeInterval = {
        type: "W",
        value: 10,
      };
      expect(getQuarterNumber(w10)).toBe(1);

      // Week 15 should be Q2
      const w15: TTimeInterval = {
        type: "W",
        value: 15,
      };
      expect(getQuarterNumber(w15)).toBe(2);

      // Week 30 should be Q3
      const w30: TTimeInterval = {
        type: "W",
        value: 30,
      };
      expect(getQuarterNumber(w30)).toBe(3);

      // Week 45 should be Q4
      const w45: TTimeInterval = {
        type: "W",
        value: 45,
      };
      expect(getQuarterNumber(w45)).toBe(4);
    });

    it("should calculate quarter from days", () => {
      // Day 30 should be Q1
      const d30: TTimeInterval = {
        type: "D",
        value: 30,
      };
      expect(getQuarterNumber(d30)).toBe(1);

      // Day 100 should be Q2
      const d100: TTimeInterval = {
        type: "D",
        value: 100,
      };
      expect(getQuarterNumber(d100)).toBe(2);

      // Day 200 should be Q3
      const d200: TTimeInterval = {
        type: "D",
        value: 200,
      };
      expect(getQuarterNumber(d200)).toBe(3);

      // Day 300 should be Q4
      const d300: TTimeInterval = {
        type: "D",
        value: 300,
      };
      expect(getQuarterNumber(d300)).toBe(4);
    });

    it("should return default 1 (Q1) for other types", () => {
      const time: TTimeInterval = {
        type: "H",
        value: 12,
      };

      expect(getQuarterNumber(time)).toBe(1);
    });
  });
});
