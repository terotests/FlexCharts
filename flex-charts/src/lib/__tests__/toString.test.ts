import { describe, it, expect } from "vitest";
import { toString } from "../time";
import type { TTimeInterval } from "../time";

describe("toString function", () => {
  describe("Automatic accuracy detection", () => {
    it("should automatically detect year accuracy", () => {
      const time: TTimeInterval = { type: "Y", value: 2023 };
      expect(toString(time)).toBe("2023");
    });

    it("should automatically detect quarter accuracy", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2023,
        increment: {
          type: "Q",
          value: 1,
        },
      };
      expect(toString(time)).toBe("2023/Q1");
    });

    it("should automatically detect month accuracy", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2023,
        increment: {
          type: "M",
          value: 3,
        },
      };
      expect(toString(time)).toBe("2023-03");
    });

    it("should automatically detect day accuracy", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2023,
        increment: {
          type: "M",
          value: 3,
          increment: {
            type: "D",
            value: 15,
          },
        },
      };
      expect(toString(time)).toBe("2023-03-15");
    });

    it("should automatically detect hour accuracy", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2023,
        increment: {
          type: "M",
          value: 3,
          increment: {
            type: "D",
            value: 15,
            increment: {
              type: "H",
              value: 14,
            },
          },
        },
      };
      expect(toString(time)).toBe("2023-03-15 14");
    });

    it("should automatically detect minute accuracy", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2023,
        increment: {
          type: "M",
          value: 3,
          increment: {
            type: "D",
            value: 15,
            increment: {
              type: "H",
              value: 14,
              increment: {
                type: "m",
                value: 30,
              },
            },
          },
        },
      };
      expect(toString(time)).toBe("2023-03-15 14:30");
    });

    it("should automatically detect second accuracy", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 2023,
        increment: {
          type: "M",
          value: 3,
          increment: {
            type: "D",
            value: 15,
            increment: {
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
            },
          },
        },
      };
      expect(toString(time)).toBe("2023-03-15 14:30:45");
    });
  });

  describe("Edge cases", () => {
    it("should handle minimum values", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 1,
        increment: {
          type: "M",
          value: 1,
          increment: {
            type: "D",
            value: 1,
            increment: {
              type: "H",
              value: 0,
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
      };
      expect(toString(time)).toBe("1-01-01 00:00:00");
    });

    it("should handle maximum reasonable values", () => {
      const time: TTimeInterval = {
        type: "Y",
        value: 9999,
        increment: {
          type: "M",
          value: 12,
          increment: {
            type: "D",
            value: 31,
            increment: {
              type: "H",
              value: 23,
              increment: {
                type: "m",
                value: 59,
                increment: {
                  type: "s",
                  value: 59,
                },
              },
            },
          },
        },
      };

      expect(toString(time)).toBe("9999-12-31 23:59:59");
    });

    it("should handle time-only values with zero hour", () => {
      const time: TTimeInterval = {
        type: "H",
        value: 0,
        increment: {
          type: "m",
          value: 30,
        },
      };
      expect(toString(time)).toBe("00:30");
    });
  });
});
