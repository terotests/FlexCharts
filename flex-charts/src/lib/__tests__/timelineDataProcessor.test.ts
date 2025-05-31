import { describe, it, expect } from "vitest";
import {
  processTimelineData,
  validateTimeSlots,
  flattenTimelineRows,
  type TimeSlot,
} from "../utils/timelineDataProcessor";
import type { TimeLineBarData } from "../components/TimeLineChart";

describe("timelineDataProcessor", () => {
  describe("processTimelineData", () => {
    it("should handle empty array", () => {
      const result = processTimelineData([], {
        start: "01/01/2020",
        end: "12/31/2020",
      });
      expect(result).toEqual([]);
    });

    it("should process single bar into single row", () => {
      const bars: TimeLineBarData[] = [
        {
          id: "test1",
          start: "01/01/2020",
          end: "12/31/2020",
          label: "Test Project",
          backgroundColor: "#blue",
        },
      ];

      const result = processTimelineData(bars, {
        start: "01/01/2020",
        end: "12/31/2020",
      });

      expect(result).toHaveLength(1);
      expect(result[0].rowId).toBe("test1");
      expect(result[0].label).toBe("Test Project");
      expect(result[0].slots).toHaveLength(1);
      expect(result[0].slots[0].relativeStart).toBe(0);
      expect(result[0].slots[0].relativeEnd).toBe(1);
      expect(result[0].slots[0].relativeWidth).toBe(1);
    });

    it("should group multiple bars with same ID", () => {
      const bars: TimeLineBarData[] = [
        {
          id: "project1",
          start: "01/01/2020",
          end: "06/30/2020",
          label: "Phase 1",
          backgroundColor: "#blue",
        },
        {
          id: "project1",
          start: "07/01/2020",
          end: "12/31/2020",
          label: "Phase 2",
          backgroundColor: "#green",
        },
      ];

      const result = processTimelineData(bars, {
        start: "01/01/2020",
        end: "12/31/2020",
      });

      expect(result).toHaveLength(1);
      expect(result[0].rowId).toBe("project1");
      expect(result[0].slots).toHaveLength(2);

      // Check that slots are properly positioned relative to row
      const slot1 = result[0].slots[0];
      const slot2 = result[0].slots[1];

      expect(slot1.relativeStart).toBe(0);
      expect(slot1.relativeEnd).toBeCloseTo(0.5, 1);
      expect(slot2.relativeStart).toBeCloseTo(0.5, 1);
      expect(slot2.relativeEnd).toBe(1);
    });

    it("should handle bars with different IDs as separate rows", () => {
      const bars: TimeLineBarData[] = [
        {
          id: "project1",
          start: "01/01/2020",
          end: "12/31/2020",
          label: "Project 1",
        },
        {
          id: "project2",
          start: "01/01/2021",
          end: "12/31/2021",
          label: "Project 2",
        },
      ];

      const result = processTimelineData(bars, {
        start: "01/01/2020",
        end: "12/31/2021",
      });

      expect(result).toHaveLength(2);
      expect(result[0].rowId).toBe("project1");
      expect(result[1].rowId).toBe("project2");
    });

    it("should sort bars within a row by start date", () => {
      const bars: TimeLineBarData[] = [
        {
          id: "project1",
          start: "07/01/2020",
          end: "12/31/2020",
          label: "Phase 2",
        },
        {
          id: "project1",
          start: "01/01/2020",
          end: "06/30/2020",
          label: "Phase 1",
        },
      ];

      const result = processTimelineData(bars, {
        start: "01/01/2020",
        end: "12/31/2020",
      });

      expect(result[0].slots[0].label).toBe("Phase 1");
      expect(result[0].slots[1].label).toBe("Phase 2");
    });

    it("should handle bars without ID by creating auto IDs", () => {
      const bars: TimeLineBarData[] = [
        {
          start: "01/01/2020",
          end: "12/31/2020",
          label: "No ID Project",
        },
      ];

      const result = processTimelineData(bars, {
        start: "01/01/2020",
        end: "12/31/2020",
      });

      expect(result).toHaveLength(1);
      expect(result[0].rowId).toBe("auto-0");
    });

    it("Should calculate relative positions correctly", () => {
      const bars: TimeLineBarData[] = [
        {
          id: "tps",
          start: "1976-09-01",
          end: "1977-04-30",
          label: "TPS",
          backgroundColor: "#FFD700", // Gold
          textColor: "black",
        },
        {
          id: "tps",
          start: "1988-09-01",
          end: "1989-04-30",
          label: "TPS",
          backgroundColor: "#FFD700",
          textColor: "black",
        },
      ];

      const result = processTimelineData(bars, {
        start: "1975",
        end: "2025",
      });

      expect(result[0].slots.length).toBe(2);

      const slot1 = result[0].slots[0];
      const slot2 = result[0].slots[1];

      console.log(slot1, slot2);

      const yearRange = 2025 - 1975; // 50 years

      console.log(
        `Year range: ${yearRange}, Slot 1 relative start: ${
          slot1.relativeStart * yearRange
        }, Slot 2 relative start: ${slot2.relativeStart}`,
        `Slot 1 relative width: ${
          slot1.relativeWidth * yearRange
        }, Slot 2 relative width: ${slot2.relativeWidth * yearRange}`
      );

      //

      //       expect(result).toHaveLength(1);
    });
  });

  describe("validateTimeSlots", () => {
    it("should return no errors for non-overlapping slots", () => {
      const slots: TimeSlot[] = [
        {
          id: "1",
          start: "01/01/2020",
          end: "06/30/2020",
          label: "Phase 1",
          relativeStart: 0,
          relativeEnd: 0.5,
          relativeWidth: 0.5,
        },
        {
          id: "2",
          start: "07/01/2020",
          end: "12/31/2020",
          label: "Phase 2",
          relativeStart: 0.5,
          relativeEnd: 1,
          relativeWidth: 0.5,
        },
      ];

      const errors = validateTimeSlots(slots);
      expect(errors).toHaveLength(0);
    });

    it("should detect overlapping slots", () => {
      const slots: TimeSlot[] = [
        {
          id: "1",
          start: "01/01/2020",
          end: "08/31/2020",
          label: "Phase 1",
          relativeStart: 0,
          relativeEnd: 0.7,
          relativeWidth: 0.7,
        },
        {
          id: "2",
          start: "07/01/2020",
          end: "12/31/2020",
          label: "Phase 2",
          relativeStart: 0.5,
          relativeEnd: 1,
          relativeWidth: 0.5,
        },
      ];

      const errors = validateTimeSlots(slots);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain("overlap");
    });

    it("should handle adjacent slots (touching but not overlapping)", () => {
      const slots: TimeSlot[] = [
        {
          id: "1",
          start: "01/01/2020",
          end: "06/30/2020",
          label: "Phase 1",
          relativeStart: 0,
          relativeEnd: 0.5,
          relativeWidth: 0.5,
        },
        {
          id: "2",
          start: "07/01/2020",
          end: "12/31/2020",
          label: "Phase 2",
          relativeStart: 0.5,
          relativeEnd: 1,
          relativeWidth: 0.5,
        },
      ];

      const errors = validateTimeSlots(slots);
      expect(errors).toHaveLength(0);
    });
  });

  describe("flattenTimelineRows", () => {
    it("should convert timeline rows back to flat data", () => {
      const rows = [
        {
          rowId: "project1",
          label: "Project 1",
          fullTimeRange: { start: "01/01/2020", end: "12/31/2020" },
          slots: [
            {
              id: "1",
              start: "01/01/2020",
              end: "06/30/2020",
              label: "Phase 1",
              backgroundColor: "#blue",
              relativeStart: 0,
              relativeEnd: 0.5,
              relativeWidth: 0.5,
            },
            {
              id: "2",
              start: "07/01/2020",
              end: "12/31/2020",
              label: "Phase 2",
              backgroundColor: "#green",
              relativeStart: 0.5,
              relativeEnd: 1,
              relativeWidth: 0.5,
            },
          ],
        },
      ];

      const result = flattenTimelineRows(rows);

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe("Phase 1");
      expect(result[1].label).toBe("Phase 2");
      expect(result[0].backgroundColor).toBe("#blue");
      expect(result[1].backgroundColor).toBe("#green");
    });
  });
});
