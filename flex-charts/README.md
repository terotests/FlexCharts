# FlexCharts

A flexible chart library for React applications.

## Features

- 📊 Multiple chart types: Line, Bar (and more to come)
- 🎨 Customizable themes with light/dark mode support
- 📱 Responsive design
- 🎯 TypeScript support with full type definitions

## Installation

```bash
npm install flex-charts
# or
yarn add flex-charts
# or
pnpm add flex-charts
```

## Quick Start

````jsx
import { LineChart } from 'flex-charts';

function App() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55],
        color: '#4e79a7',
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27],
        color: '#f28e2c',
      },
    ],
  };

  return (
    <LineChart
      data={data}
      options={{
        width: 600,
        height: 400,
        title: 'My Chart'
      }}
    />
  );
}

## Development

This package uses a dual setup:

1. **Library Code**: Located in `src/lib/`, this is the actual chart library code that gets published to npm.
2. **Playground**: The rest of the app serves as a development sandbox to test the components.

### Development Commands

```bash
# Start the development playground
npm run dev

# Build the library for publishing
npm run build

# Build the playground for deployment
npm run build:playground

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
````

## API Reference

### LineChart

```tsx
import { LineChart } from "flex-charts";

<LineChart data={ChartData} options={ChartOptions} />;
```

### BarChart

```tsx
import { BarChart } from "flex-charts";

<BarChart data={ChartData} options={ChartOptions} />;
```

### Theming

```tsx
import { useChartTheme } from "flex-charts";

function App() {
  const { theme, toggleTheme, setThemeMode } = useChartTheme("light");

  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {/* Your charts here */}
    </div>
  );
}
```

### Time Utilities

FlexCharts includes a powerful time handling utility (`time.ts`) that provides functions for working with different time intervals and calculating time-based positions for data visualization.

```tsx
import {
  calculateTimeSlot,
  convertToSeconds,
  getTimeDifferenceInUnit,
} from "flex-charts";

// Create time intervals
const startTime = { type: "Y", value: 2023 };
const endTime = { type: "Y", value: 2024 };
const currentTime = {
  type: "Y",
  value: 2023,
  increment: { type: "M", value: 6 },
}; // 2023-06

// Calculate where a point falls within a time range (returns 0.5 for the middle)
const position = calculateTimeSlot(
  { start: startTime, end: endTime },
  currentTime
);

// Convert time intervals to seconds for calculations
const seconds = convertToSeconds(currentTime);

// Get difference between times in specific units
const monthsDiff = getTimeDifferenceInUnit(startTime, endTime, "M"); // 12
```

#### Available Time Units

- `Y` - Years
- `M` - Months
- `Q` - Quarters
- `W` - Weeks
- `D` - Days
- `H` - Hours
- `m` - Minutes
- `s` - Seconds

#### Key Time Functions

- `convertToSeconds()`: Converts a time interval to seconds
- `getTimeDifferenceInSeconds()`: Gets the difference between two time points in seconds
- `getTimeDifferenceInUnit()`: Gets the difference between two time points in a specified unit
- `calculateTimeSlot()`: Determines where a time value falls within a range (0-1)
- `parseTimeString()`: Parses time strings according to specified formats
- `dateToTimeInterval()`: Converts a JavaScript Date object to a TTimeInterval
- `timeIntervalToDate()`: Converts a TTimeInterval to a JavaScript Date object
- `isTimeInRange()`: Checks if a time value falls within a specific range

#### Understanding `parseTimeString`

The `parseTimeString` function converts string representations of dates and times into the library's internal `TTimeInterval` format. This is especially useful when working with user inputs or data coming from various sources in different formats.

```typescript
parseTimeString(timeString: string, format: string | TTimeParserKernel = defaultTimeParserKernel): TTimeInterval
```

**Parameters:**

- `timeString`: The string to parse (e.g., "2025-01-15", "3 years", "08:30")
- `format`: (Optional) Either a specific format string or a TTimeParserKernel object containing multiple patterns

**Usage Examples:**

```typescript
// Using specific format strings
const date1 = parseTimeString("2025-01-15", "YYYY-MM-DD");
const time1 = parseTimeString("08:30:22", "HH:mm:ss");

// Using the default kernel (automatically tries multiple patterns)
const date2 = parseTimeString("2025-01-15"); 
const date3 = parseTimeString("15.01.2025"); // European format
const duration = parseTimeString("3 years");

// Creating a custom parser kernel
const myCustomFormats: TTimeParserKernel = {
  patterns: [
    "MM-DD-YYYY",
    "DD/MM/YY"
    // Add your custom patterns here
  ]
};
const date4 = parseTimeString("12-25-2025", myCustomFormats);
```

**Supported Format Patterns:**

The library includes many pre-configured patterns in the `defaultTimeParserKernel`, including:

1. Date formats:
   - ISO style: "YYYY-MM-DD", "YYYY/MM/DD"
   - US style: "MM/DD/YYYY"
   - European style: "DD.MM.YYYY", "DD-MM-YYYY"
   - Partial dates: "YYYY-MM", "MM/YYYY"

2. Quarter formats:
   - "YYYY/Q", "Q1/YYYY", "YYYY'Q'Q"

3. Time formats:
   - "HH:mm:ss", "HH:mm", "H:mm:s"

4. Duration formats:
   - "Y' years'", "M' months'", "D' days'", "H' hours'", etc.

You can extend these with your own custom patterns when needed.
