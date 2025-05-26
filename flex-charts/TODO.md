# FlexCharts Library - TODO List

## Time Utilities (time.ts) Improvements

### High Priority Tasks

1. **Improve Time Unit Precision**

   - Replace approximate conversions (e.g., months to seconds) with more accurate calculations
   - Handle leap years properly in year calculations
   - Use actual days in month for month calculations

2. **Add Date Object Integration**

   - Implement functions to convert between native JavaScript Date objects and TTimeInterval
   - Example: `dateToTimeInterval(date: Date): TTimeInterval`
   - Example: `timeIntervalToDate(time: TTimeInterval): Date`

3. **Enhance Time Format Parsing**

   - Support more flexible format strings for time parsing
   - Handle multi-digit numbers properly (currently assumes single digit)
   - Support delimiters in parsing and formatting

4. **Add Time Range Validation**
   - Add functions to check if a time falls within a specified range
   - Example: `isTimeInRange(time: TTime, range: TTimeSpan): boolean`

### Medium Priority Tasks

5. **Add Relative Time Operations**

   - Add functions to add/subtract time intervals
   - Example: `addTimeInterval(time: TTimeInterval, toAdd: TTimeInterval): TTimeInterval`
   - Example: `subtractTimeInterval(time: TTimeInterval, toSubtract: TTimeInterval): TTimeInterval`

6. **Create Time Scale Generation**

   - Function to generate evenly spaced time intervals
   - Example: `generateTimeRange(start: TTimeInterval, end: TTimeInterval, steps: number): TTimeInterval[]`

7. **Support for Time Zones**

   - Add timezone support for more accurate global time handling
   - Conversion between different timezones

8. **Format String for Output**
   - Add formatting function to create string representations of time intervals
   - Example: `formatTimeInterval(time: TTimeInterval, format: string): string`

### Lower Priority Tasks

9. **Create Time Aggregation Functions**

   - Implement functions to group time-based data by intervals
   - Example: `aggregateByTime(data: any[], timeKey: string, interval: TTimeIntervalType): any[]`

10. **Performance Optimizations**

    - Cache conversion results where appropriate
    - Optimize algorithms for large datasets or frequent calculations

11. **More Time Unit Types**

    - Add support for more granular time units (milliseconds, microseconds)
    - Add support for fiscal quarters, fiscal years

12. **Documentation & Examples**
    - Add JSDoc comments to all functions
    - Create more example code for common use cases
    - Add visual examples showing how time calculations integrate with charts

## Testing Improvements

1. **Expand Test Coverage**

   - Add tests for edge cases (negative years, very large values, etc.)
   - Add tests for each time unit and combination of units
   - Test invalid inputs and error handling

2. **Performance Testing**

   - Add performance benchmarks for time operations
   - Compare performance with native Date operations

3. **Integration Tests with Charts**
   - Test how time utilities integrate with chart components
   - Ensure time-based charts correctly use the time utilities

## Known Issues to Fix

1. `parseTimeString` function assumes time string characters align with format string positions
2. Inconsistent zero indexing for different unit types (days vs. months)
3. Time calculations use approximations for month and year lengths
