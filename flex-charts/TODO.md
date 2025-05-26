# FlexCharts Library - TODO List

## Time Utilities (time.ts) Improvements

### Completed Tasks ✅

1. **Improve Time Unit Precision**
   - ✅ Handle leap years properly in year calculations
   - ✅ Added `isLeapYear` function to accurately determine leap years
   - ✅ Added actual days calculation for February in leap years

2. **Add Date Object Integration**
   - ✅ Implemented `dateToTimeInterval(date: Date, accuracy: TTimeIntervalType): TTimeInterval`
   - ✅ Implemented `timeIntervalToDate(time: TTimeInterval, accuracy: TTimeIntervalType): Date`
   - ✅ Added tests for date object conversions

3. **Enhance Time Format Parsing**
   - ✅ Added support for more formats like YYYY/Q (year and quarter)
   - ✅ Enhanced parsing to handle multi-digit values
   - ✅ Added support for different date format patterns

### High Priority Tasks (Remaining)

1. **Further Improve Time Unit Precision**
   - Replace approximate conversions (e.g., months to seconds) with more accurate calculations
   - Use actual days in month for all month calculations, not just February

2. **Enhance Time Format Parsing**
   - Support more flexible format strings for time parsing
   - Add better error handling for invalid formats

3. **Add Time Range Validation**
   - Add functions to check if a time falls within a specified range
   - Example: `isTimeInRange(time: TTime, range: TTimeSpan): boolean`

### Medium Priority Tasks

4. **Add Relative Time Operations**
   - Add functions to add/subtract time intervals
   - Example: `addTimeInterval(time: TTimeInterval, toAdd: TTimeInterval): TTimeInterval`
   - Example: `subtractTimeInterval(time: TTimeInterval, toSubtract: TTimeInterval): TTimeInterval`

5. **Create Time Scale Generation**
   - Function to generate evenly spaced time intervals
   - Example: `generateTimeRange(start: TTimeInterval, end: TTimeInterval, steps: number): TTimeInterval[]`

6. **Support for Time Zones**
   - Add timezone support for more accurate global time handling
   - Conversion between different timezones

7. **Format String for Output**
   - Add formatting function to create string representations of time intervals
   - Example: `formatTimeInterval(time: TTimeInterval, format: string): string`

### Lower Priority Tasks

8. **Create Time Aggregation Functions**
   - Implement functions to group time-based data by intervals
   - Example: `aggregateByTime(data: any[], timeKey: string, interval: TTimeIntervalType): any[]`

9. **Performance Optimizations**
    - Cache conversion results where appropriate
    - Optimize algorithms for large datasets or frequent calculations

10. **More Time Unit Types**
    - ✅ Added support for quarters (Q)
    - ✅ Added support for weeks (W)
    - Add support for more granular time units (milliseconds, microseconds)
    - Add support for fiscal quarters, fiscal years

11. **Documentation & Examples**
    - ✅ Added basic documentation in README.md for time utilities
    - ✅ Added TODO.md with improvement plans
    - Add JSDoc comments to all functions
    - Create more example code for common use cases
    - Add visual examples showing how time calculations integrate with charts

## Testing Improvements

1. **Expand Test Coverage**
   - ✅ Added comprehensive tests for most time unit types
   - ✅ Added tests for leap year handling
   - ✅ Added tests for time calculations with different units
   - Add additional tests for edge cases (negative years, very large values, etc.)
   - Add more tests for invalid inputs and error handling

2. **Performance Testing**
   - Add performance benchmarks for time operations
   - Compare performance with native Date operations

3. **Integration Tests with Charts**
   - ✅ Added basic functionality to work with chart time scales
   - Test how time utilities integrate with chart components
   - Ensure time-based charts correctly use the time utilities

## Known Issues to Fix

1. `parseTimeString` function still assumes time string characters align with format string positions in some cases
2. Inconsistent zero indexing for different unit types (days vs. months)
3. ✅ Leap year calculations have been improved, but some time calculations still use approximations
4. ✅ Added proper time conversion between Date objects and TTimeInterval, but could be further optimized
5. Need to document time utilities better in the codebase with complete JSDoc
