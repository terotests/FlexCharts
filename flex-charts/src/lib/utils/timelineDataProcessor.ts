import type { TimeLineBarData } from "../components/TimeLineChart";
import {
  calculateTimeSlot,
  parseTimeString,
  timeIntervalToDate,
} from "../time";

/**
 * Represents a single time slot within a timeline row
 */
export interface TimeSlot {
  id: string | number;
  start: string;
  end: string;
  label: string;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  relativeStart: number; // 0-1 position within the row
  relativeEnd: number; // 0-1 position within the row
  relativeWidth: number; // Width as percentage of row
}

/**
 * Represents a timeline row that can contain multiple time slots
 */
export interface TimelineRow {
  rowId: string | number;
  label: string;
  className?: string;
  slots: TimeSlot[];
  fullTimeRange: {
    start: string;
    end: string;
  };
}

/**
 * Processes timeline bar data and groups by ID, handling overlapping time periods
 * @param bars Array of timeline bar data
 * @returns Array of timeline rows with processed slots
 */
export function processTimelineData(
  bars: TimeLineBarData[],
  range: {
    start?: string;
    end?: string;
  }
): TimelineRow[] {
  if (!bars.length) return [];

  if (!range.start || !range.end) {
    throw new Error("Range start and end must be provided");
  }

  // Group bars by ID (or use a unique key if ID is missing)
  const groupedBars = new Map<string | number, TimeLineBarData[]>();

  bars.forEach((bar, index) => {
    const key = bar.id ?? `auto-${index}`;
    if (!groupedBars.has(key)) {
      groupedBars.set(key, []);
    }
    groupedBars.get(key)!.push(bar);
  });

  // Process each group into timeline rows
  const rows: TimelineRow[] = [];

  groupedBars.forEach((groupBars, groupId) => {
    // Sort bars by start date
    const sortedBars = groupBars.sort((a, b) => {
      const aStart = timeIntervalToDate(parseTimeString(a.start), "D");
      const bStart = timeIntervalToDate(parseTimeString(b.start), "D");
      return aStart.getTime() - bStart.getTime();
    });

    // Find the overall time range for this row
    const startTimes = sortedBars.map((bar) =>
      timeIntervalToDate(parseTimeString(bar.start), "D")
    );
    const endTimes = sortedBars.map((bar) =>
      timeIntervalToDate(parseTimeString(bar.end), "D")
    );

    const rowStart = new Date(Math.min(...startTimes.map((d) => d.getTime())));
    const rowEnd = new Date(Math.max(...endTimes.map((d) => d.getTime())));

    const rowStartStr = formatDateToString(rowStart);
    const rowEndStr = formatDateToString(rowEnd);

    const slots: TimeSlot[] = sortedBars.map((bar, index) => {
      const relativeStart = calculateTimeSlot(
        {
          start: parseTimeString(range.start!),
          end: parseTimeString(range.end!),
        },
        parseTimeString(bar.start)
      );

      const relativeEnd = calculateTimeSlot(
        {
          start: parseTimeString(range.start!),
          end: parseTimeString(range.end!),
        },
        parseTimeString(bar.end)
      );
      return {
        id: bar.id ?? `${groupId}-slot-${index}`,
        start: bar.start,
        end: bar.end,
        label: bar.label,
        color: bar.color,
        backgroundColor: bar.backgroundColor,
        textColor: bar.textColor,
        className: bar.className,
        relativeStart,
        relativeEnd,
        relativeWidth: relativeEnd - relativeStart,
      };
    });

    // Use the first bar's label as row label, or create a generic one
    const rowLabel =
      sortedBars.length === 1 ? sortedBars[0].label : `${sortedBars[0].label}`;
    rows.push({
      rowId: groupId,
      label: rowLabel,
      className: sortedBars[0].className, // Use className from first bar in group
      slots,
      fullTimeRange: {
        start: rowStartStr,
        end: rowEndStr,
      },
    });
  });
  // Sort rows by their start time
  return rows.sort((a, b) => {
    const aStart = timeIntervalToDate(
      parseTimeString(a.fullTimeRange.start),
      "D"
    );
    const bStart = timeIntervalToDate(
      parseTimeString(b.fullTimeRange.start),
      "D"
    );
    return aStart.getTime() - bStart.getTime();
  });
}

/**
 * Validates that time slots within a row don't overlap
 * @param slots Array of time slots to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateTimeSlots(slots: TimeSlot[]): string[] {
  const errors: string[] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const slot1 = slots[i];
      const slot2 = slots[j];

      // Check for overlap
      const overlap = !(
        slot1.relativeEnd <= slot2.relativeStart ||
        slot2.relativeEnd <= slot1.relativeStart
      );

      if (overlap) {
        errors.push(
          `Time slots "${slot1.label}" (${slot1.start}-${slot1.end}) and "${slot2.label}" (${slot2.start}-${slot2.end}) overlap`
        );
      }
    }
  }

  return errors;
}

/**
 * Helper function to format Date object back to string format
 * @param date Date object to format
 * @returns Formatted date string
 */
function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

/**
 * Converts processed timeline rows back to flat TimeLineBarData array
 * This is useful for backwards compatibility with existing components
 * @param rows Array of timeline rows
 * @returns Flat array of timeline bar data
 */
export function flattenTimelineRows(rows: TimelineRow[]): TimeLineBarData[] {
  const flatData: TimeLineBarData[] = [];

  rows.forEach((row) => {
    row.slots.forEach((slot) => {
      flatData.push({
        id: slot.id,
        start: slot.start,
        end: slot.end,
        label: slot.label,
        color: slot.color,
        backgroundColor: slot.backgroundColor,
        textColor: slot.textColor,
        className: slot.className,
      });
    });
  });

  return flatData;
}
