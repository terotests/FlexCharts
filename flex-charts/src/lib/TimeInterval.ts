/**
 * TimeInterval utility class - A chainable wrapper around time.ts functions
 * Provides better autocomplete experience and fluent API for time operations
 *
 * @example
 * ```typescript
 * // Parse time strings with fluent API
 * const start = Time.parse("2024-01-01");
 * const end = Time.parse("2024-12-31");
 *
 * // Create time spans
 * const span = Time.span("2024-01-01", "2024-12-31");
 *
 * // Calculate differences
 * const diffInMonths = start.diffInUnit(end, "M"); // 12 months
 *
 * // Chain operations
 * const currentYear = Time.now("Y")
 *   .withValue(2024)
 *   .withIncrement(Time.parse("03", "MM")); // 2024-03
 *
 * // Export as plain object
 * const timeData = start.toJSON(); // TTimeInterval
 *
 * // Use in timeline data
 * const bars: TimeLineBarData[] = [
 *   {
 *     id: 1,
 *     start: start.toString(),
 *     end: end.toString(),
 *     label: "Project Timeline"
 *   }
 * ];
 * ```
 */

import type {
  TTimeInterval,
  TTimeIntervalType,
  TTimeSpan,
  TTimeIntervalTypeWithDecades,
  TTimeParserKernel,
} from "./time";
import {
  parseTimeString,
  convertToSeconds,
  getTimeDifferenceInSeconds,
  getTimeDifferenceInUnit,
  calculateTimeSlot,
  dateToTimeInterval,
  timeIntervalToDate,
  isTimeInRange,
  convertSecondsToTimeInterval,
  splitTimeRangeIntoIntervals,
  compare,
  toString as timeToString,
} from "./time";

/**
 * Chainable TimeInterval utility class
 * Wraps TTimeInterval and provides fluent API for time operations
 */
export class TimeInterval {
  private _interval: TTimeInterval;

  constructor(interval: TTimeInterval) {
    this._interval = { ...interval };
  }

  /**
   * Create TimeInterval from a time string
   * @param timeString The time string to parse (e.g., "2024-01-15", "2024/Q2", "3 years")
   * @param format Optional format string or parser kernel
   */
  static from(
    timeString: string,
    format?: string | TTimeParserKernel
  ): TimeInterval {
    return new TimeInterval(parseTimeString(timeString, format));
  }

  /**
   * Create TimeInterval from a Date object
   * @param date The Date object
   * @param accuracy The accuracy level for conversion
   */
  static fromDate(date: Date, accuracy: TTimeIntervalType): TimeInterval {
    return new TimeInterval(dateToTimeInterval(date, accuracy));
  }

  /**
   * Create TimeInterval from seconds
   * @param seconds Number of seconds
   * @param type The time interval type
   */
  static fromSeconds(seconds: number, type: TTimeIntervalType): TimeInterval {
    return new TimeInterval(convertSecondsToTimeInterval(seconds, type));
  }

  /**
   * Create TimeInterval for current date/time
   * @param accuracy The accuracy level
   */
  static now(accuracy: TTimeIntervalType = "Y"): TimeInterval {
    return TimeInterval.fromDate(new Date(), accuracy);
  }

  /**
   * Get the underlying TTimeInterval object
   */
  get raw(): TTimeInterval {
    return { ...this._interval };
  }

  /**
   * Get the type of this time interval
   */
  get type(): TTimeIntervalType {
    return this._interval.type;
  }

  /**
   * Get the value of this time interval
   */
  get value(): number {
    return this._interval.value;
  }

  /**
   * Get the increment of this time interval (if any)
   */
  get increment(): TimeInterval | null {
    return this._interval.increment
      ? new TimeInterval(this._interval.increment)
      : null;
  }

  /**
   * Convert this TimeInterval to seconds
   * @param isDelta Whether this is a delta (duration) calculation
   * @param year Optional year for context
   */
  toSeconds(isDelta = false, year: number | null = null): number {
    return convertToSeconds(this._interval, isDelta, year);
  }

  /**
   * Convert this TimeInterval to a Date object
   * @param accuracy The accuracy level for conversion
   */
  toDate(accuracy: TTimeIntervalType): Date {
    return timeIntervalToDate(this._interval, accuracy);
  }

  /**
   * Calculate the difference between this and another TimeInterval in seconds
   * @param other The other TimeInterval
   */
  diffInSeconds(other: TimeInterval): number {
    return getTimeDifferenceInSeconds(this._interval, other._interval);
  }

  /**
   * Calculate the difference between this and another TimeInterval in specified unit
   * @param other The other TimeInterval
   * @param unit The unit to return the difference in
   */
  diffInUnit(other: TimeInterval, unit: TTimeIntervalType): number {
    return getTimeDifferenceInUnit(this._interval, other._interval, unit);
  }

  /**
   * Calculate where this TimeInterval falls within a span (0-1)
   * @param span The time span to calculate position within
   */
  positionInSpan(span: TimeSpan): number {
    return calculateTimeSlot(span.raw, this._interval);
  }

  /**
   * Check if this TimeInterval is within a given range
   * @param range The range to check against
   */
  isInRange(range: { start: TimeInterval; end: TimeInterval }): boolean {
    return isTimeInRange({
      time: this._interval,
      range: {
        start: range.start._interval,
        end: range.end._interval,
      },
    });
  }

  /**
   * Create a new TimeInterval with modified value
   * @param value The new value
   */
  withValue(value: number): TimeInterval {
    return new TimeInterval({
      ...this._interval,
      value,
    });
  }

  /**
   * Create a new TimeInterval with modified type
   * @param type The new type
   */
  withType(type: TTimeIntervalType): TimeInterval {
    return new TimeInterval({
      ...this._interval,
      type,
    });
  }

  /**
   * Create a new TimeInterval with added increment
   * @param increment The increment to add
   */
  withIncrement(increment: TimeInterval): TimeInterval {
    return new TimeInterval({
      ...this._interval,
      increment: increment._interval,
    });
  }

  /**
   * Create a copy of this TimeInterval
   */
  clone(): TimeInterval {
    return new TimeInterval(this._interval);
  }

  /**
   * Export as plain JavaScript object
   */
  toJSON(): TTimeInterval {
    return this.raw;
  }
  /**
   * String representation of this TimeInterval based on accuracy
   * @returns A string representation of the time interval
   *
   * @example
   * // Automatic accuracy detection
   * Time.parse("2023").toString() // "2023"
   * Time.parse("2023/Q1").toString() // "2023/Q1"
   * Time.parse("2023-03").toString() // "2023-03"
   * Time.parse("2023-03-15").toString() // "2023-03-15"
   *
   */ toString(): string {
    // Use automatic accuracy detection
    return timeToString(this._interval);
  }

  /**
   * Check if this TimeInterval equals another
   * @param other The other TimeInterval to compare
   */
  equals(other: TimeInterval): boolean {
    return compare(this._interval, other._interval) === 0;
  }
  /**
   * Compare this TimeInterval with another
   * @param other The other TimeInterval to compare
   * @returns -1 if this is before other, 0 if equal, 1 if this is after other
   */
  compare(other: TimeInterval): -1 | 0 | 1 {
    return compare(this._interval, other._interval);
  }

  /**
   * Check if this TimeInterval is before another
   * @param other The other TimeInterval to compare
   */
  isBefore(other: TimeInterval): boolean {
    return this.compare(other) < 0;
  }

  /**
   * Check if this TimeInterval is after another
   * @param other The other TimeInterval to compare
   */
  isAfter(other: TimeInterval): boolean {
    return this.compare(other) > 0;
  }

  /**
   * Check if this TimeInterval is the same as another
   * @param other The other TimeInterval to compare
   */
  isSame(other: TimeInterval): boolean {
    return this.compare(other) === 0;
  }
}

/**
 * TimeSpan utility class - represents a span between two TimeIntervals
 */
export class TimeSpan {
  private _span: TTimeSpan;

  constructor(start: TimeInterval, end: TimeInterval) {
    this._span = {
      start: start.raw,
      end: end.raw,
    };
  }

  /**
   * Create TimeSpan from time strings
   * @param startString Start time string
   * @param endString End time string
   * @param format Optional format for parsing
   */
  static from(
    startString: string,
    endString: string,
    format?: string | TTimeParserKernel
  ): TimeSpan {
    return new TimeSpan(
      TimeInterval.from(startString, format),
      TimeInterval.from(endString, format)
    );
  }

  /**
   * Get the underlying TTimeSpan object
   */
  get raw(): TTimeSpan {
    return {
      start: { ...this._span.start },
      end: { ...this._span.end },
    };
  }

  /**
   * Get the start TimeInterval
   */
  get start(): TimeInterval {
    return new TimeInterval(this._span.start);
  }

  /**
   * Get the end TimeInterval
   */
  get end(): TimeInterval {
    return new TimeInterval(this._span.end);
  }

  /**
   * Get the duration of this span in seconds
   */
  get durationInSeconds(): number {
    return getTimeDifferenceInSeconds(this._span.start, this._span.end);
  }

  /**
   * Get the duration of this span in specified unit
   * @param unit The unit to return duration in
   */
  durationInUnit(unit: TTimeIntervalType): number {
    return getTimeDifferenceInUnit(this._span.start, this._span.end, unit);
  }

  /**
   * Split this span into intervals
   * @param interval The interval type to split by
   */
  splitInto(interval: TTimeIntervalTypeWithDecades): TimeInterval[] {
    return splitTimeRangeIntoIntervals(this._span, interval).map(
      (ti) => new TimeInterval(ti)
    );
  }

  /**
   * Calculate where a TimeInterval falls within this span (0-1)
   * @param timeInterval The TimeInterval to locate within this span
   */
  positionOf(timeInterval: TimeInterval): number {
    return calculateTimeSlot(this._span, timeInterval.raw);
  }

  /**
   * Check if a TimeInterval is within this span
   * @param timeInterval The TimeInterval to check
   */
  contains(timeInterval: TimeInterval): boolean {
    return timeInterval.isInRange({
      start: this.start,
      end: this.end,
    });
  }

  /**
   * Create a new TimeSpan with different start
   * @param start The new start TimeInterval
   */
  withStart(start: TimeInterval): TimeSpan {
    return new TimeSpan(start, this.end);
  }

  /**
   * Create a new TimeSpan with different end
   * @param end The new end TimeInterval
   */
  withEnd(end: TimeInterval): TimeSpan {
    return new TimeSpan(this.start, end);
  }

  /**
   * Export as plain JavaScript object
   */
  toJSON(): TTimeSpan {
    return this.raw;
  }

  /**
   * String representation of this TimeSpan
   */
  toString(): string {
    return `${this.start.toString()} - ${this.end.toString()}`;
  }

  /**
   * Clone this TimeSpan
   */
  clone(): TimeSpan {
    return new TimeSpan(this.start, this.end);
  }
}

/**
 * Utility functions for creating TimeInterval and TimeSpan instances
 */
export const Time = {
  /**
   * Parse a time string into a TimeInterval
   */
  parse: (timeString: string, format?: string | TTimeParserKernel) =>
    TimeInterval.from(timeString, format),

  /**
   * Create TimeInterval from Date
   */
  fromDate: (date: Date, accuracy: TTimeIntervalType) =>
    TimeInterval.fromDate(date, accuracy),

  /**
   * Create TimeInterval for current time
   */
  now: (accuracy: TTimeIntervalType = "Y") => TimeInterval.now(accuracy),

  /**
   * Create TimeInterval from seconds
   */
  fromSeconds: (seconds: number, type: TTimeIntervalType) =>
    TimeInterval.fromSeconds(seconds, type),

  /**
   * Create TimeSpan from two time strings
   */
  span: (
    startString: string,
    endString: string,
    format?: string | TTimeParserKernel
  ) => TimeSpan.from(startString, endString, format),

  /**
   * Create TimeSpan from two TimeIntervals
   */
  spanFrom: (start: TimeInterval, end: TimeInterval) =>
    new TimeSpan(start, end),
};

// Export types for convenience
export type {
  TTimeInterval,
  TTimeIntervalType,
  TTimeSpan,
  TTimeIntervalTypeWithDecades,
  TTimeParserKernel,
};
