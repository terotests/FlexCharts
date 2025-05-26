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
