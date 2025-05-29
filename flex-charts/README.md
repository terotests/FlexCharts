# FlexCharts

> **⚠️ WORK IN PROGRESS**
>
> This library is currently under active development. The documentation below is a draft and describes planned functionality that may not be fully implemented yet. Features, APIs, and examples are subject to change.

A flexible chart library for React applications focused on time-based visualizations with advanced customization capabilities.

## Planned Features

### Core Functionality

- 📐 **Flexible Layout System** - Adaptive wireframe structure with proper data positioning
- 🔄 **Smooth Scrolling** - Horizontal and vertical scrolling with touch support
- 📏 **Configurable Axes** - Customizable x and y axis with support for various data types
- 📊 **Multiple Chart Types** - Line, Bar, Timeline, and more to come

### Advanced Capabilities

- 🧩 **Gantt Chart Support** - Connect time series elements to create dependencies
- ✏️ **Live Editing** - Real-time chart modification and data manipulation
- 📤 **Data Export** - Export to Excel, CSV and other formats
- 🎛️ **Live Configuration** - Adjust chart settings and appearance in real-time

### User Experience

- 🎨 **Theming & Customization** - Light/dark mode and custom rendering overrides
- 🚀 **Performance Optimization** - Virtualization for large datasets and view optimization
- 📱 **Responsive Design** - Adapt to different screen sizes and orientations
- 🎯 **Full TypeScript Support** - Complete type definitions for enhanced developer experience

## Installation

```bash
npm install flex-charts
# or
yarn add flex-charts
# or
pnpm add flex-charts
```

## 🌐 Live Demo

**[View the live demo on GitHub Pages →](https://terotests.github.io/FlexCharts/)**

The demo showcases the TimeLineChart component with interactive examples and code snippets. The demo is automatically deployed from the `main` branch using GitHub Actions whenever changes are pushed to the repository.

### Local Development

To run the demo locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/FlexCharts.git
cd FlexCharts/flex-charts

# Install dependencies
npm install

# Start the development server
npm run dev
```

The demo will be available at `http://localhost:3000`.

### Building and Deployment

The demo is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. You can also build and preview it locally:

```bash
# Build the demo for production
npm run build:playground

# Preview the production build
npm run preview
```

## Planned Usage

> **Note:** The examples below illustrate the intended API, which is still under development.

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

### TimeLineChart

The TimeLineChart component provides a timeline visualization that can display bars representing time periods with custom colors and labels.

```tsx
import { TimeLineChart, type TimeLineBarData } from "flex-charts";

// Define your data
const timelineBars: TimeLineBarData[] = [
  {
    id: 1,
    start: "01/2020",
    end: "12/2022",
    label: "Project Alpha",
    backgroundColor: "#3b82f6",
    textColor: "white",
  },
  {
    id: 2,
    start: "06/2021",
    end: "03/2024",
    label: "Project Beta",
    backgroundColor: "#ef4444",
    textColor: "white",
  },
];

function Timeline() {
  return (
    <TimeLineChart
      startDate="2020"
      endDate="2025"
      interval="Y"
      width="800px"
      labelFontSize="12px"
      bars={timelineBars}
      renderTitle={(time) => `'${time.value.toString().slice(2, 4)}`}
    />
  );
}
```

#### TimeLineChart Props

| Prop            | Type                                | Required | Description                                                                                                                                          |
| --------------- | ----------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `startDate`     | `string`                            | Yes      | Start date of the timeline (e.g., "2020", "01/2020")                                                                                                 |
| `endDate`       | `string`                            | Yes      | End date of the timeline (e.g., "2025", "12/2025")                                                                                                   |
| `interval`      | `TTimeIntervalType`                 | Yes      | Time interval type (`"Y"`, `"M"`, `"Q"`, `"W"`, `"D"`, `"H"`, `"m"`, `"s"`)                                                                          |
| `bars`          | `TimeLineBarData[]`                 | No       | Array of bar data to display. If not provided, only time slots are shown                                                                             |
| `width`         | `string`                            | No       | Width of the component (default: "100%")                                                                                                             |
| `labelFontSize` | `string`                            | No       | Font size for time slot labels (default: "12px")                                                                                                     |
| `renderTitle`   | `(time: TTimeInterval) => string`   | No       | Custom function to render time slot labels                                                                                                           |
| `onBarClick`    | `(clickData: BarClickData) => void` | No       | Callback function called when a bar is clicked. Receives comprehensive click data including bar info, position, dimensions, and controller reference |

#### TimeLineBarData Interface

```tsx
interface TimeLineBarData {
  id?: string | number; // Optional unique identifier
  start: string; // Start date/time string
  end: string; // End date/time string
  label: string; // Text to display on the bar
  color?: string; // Border color (defaults to backgroundColor)
  backgroundColor?: string; // Background color (default: "#3b82f6")
  textColor?: string; // Text color (default: "white")
}
```

#### BarClickData Interface

The `BarClickData` interface provides comprehensive information when a bar is clicked, including a reference to the chart controller for programmatic chart control:

```tsx
interface BarClickData {
  // Bar data
  bar: TimeLineBarData;
  // Position within the chart (0-1, where 0 is start of chart, 1 is end)
  relativePosition: {
    start: number; // Position where bar starts (0-1)
    end: number; // Position where bar ends (0-1)
    center: number; // Center position of the bar (0-1)
  };
  // Dimensions and positioning
  dimensions: {
    width: number; // Bar's pixel width
    height: number; // Bar's pixel height
    left: number; // Bar's absolute position in viewport
    top: number; // Bar's absolute position in viewport
    chartWidth: number; // Chart container width for context
    chartHeight: number; // Chart container height for context
  };
  // Chart controller reference for programmatic chart control
  controller: TimeLineChartController;
  // Original mouse event
  event: React.MouseEvent<HTMLDivElement>;
}
```

#### Usage Examples

**Basic Timeline (no bars, only time slots):**

```tsx
<TimeLineChart startDate="2020" endDate="2025" interval="Y" />
```

**Project Timeline with Bar Click Handler:**

```tsx
import {
  TimeLineChart,
  type BarClickData,
  type TimeLineBarData,
} from "flex-charts";

const projectData: TimeLineBarData[] = [
  {
    id: "planning",
    start: "01/2024",
    end: "03/2024",
    label: "Planning Phase",
    backgroundColor: "#fbbf24",
    textColor: "#000",
  },
  {
    id: "development",
    start: "03/2024",
    end: "10/2024",
    label: "Development",
    backgroundColor: "#22c55e",
  },
  {
    id: "testing",
    start: "09/2024",
    end: "12/2024",
    label: "Testing & QA",
    backgroundColor: "#ef4444",
  },
];

const handleBarClick = (clickData: BarClickData) => {
  const { bar, relativePosition, dimensions, controller } = clickData;

  // Access bar information
  console.log(`Clicked bar: ${bar.label}`);
  console.log(`Time range: ${bar.start} - ${bar.end}`);

  // Use position data
  console.log(
    `Bar spans from ${(relativePosition.start * 100).toFixed(1)}% to ${(
      relativePosition.end * 100
    ).toFixed(1)}%`
  );

  // Programmatically control the chart using the controller
  controller.scrollTo(relativePosition.center); // Center the clicked bar

  // Access dimensions
  console.log(`Bar size: ${dimensions.width}px × ${dimensions.height}px`);
};

<TimeLineChart
  startDate="01/2024"
  endDate="12/2024"
  interval="M"
  bars={projectData}
  onBarClick={handleBarClick}
  width="1000px"
  renderTitle={(time) => time.value.toString().slice(0, 3)}
/>;
```

**Timeline with Controller Access:**

```tsx
import { useRef } from "react";
import { TimeLineChart, type TimeLineChartController } from "flex-charts";

function Timeline() {
  const chartRef = useRef<TimeLineChartController>(null);

  const handleBarClick = (clickData: BarClickData) => {
    // Use the controller reference from click data (recommended)
    clickData.controller.scrollToCenter();

    // Or use the ref (alternative approach)
    chartRef.current?.scrollTo(clickData.relativePosition.start);
  };

  return (
    <TimeLineChart
      ref={chartRef}
      startDate="2020"
      endDate="2025"
      interval="Y"
      bars={projectData}
      onBarClick={handleBarClick}
    />
  );
}
```

#### TimeLineChartController

The TimeLineChart component provides a controller reference that enables programmatic chart control:

```tsx
interface TimeLineChartController {
  // Chart information
  chartId: string;
  isInitialized: boolean;
  startDate: string;
  endDate: string;
  barCount: number;

  // Scroll control (position values: 0 = start, 1 = end)
  scrollTo(position: number): void;
  scrollToStart(): void;
  scrollToCenter(): void;
  scrollToEnd(): void;

  // Dimension tracking
  getDimensions(): {
    visible: { width: number; height: number } | null;
    total: { width: number; height: number } | null;
  };
  onDimensionChange(callback: (dimensions) => void): () => void;

  // Element access
  getAllBarElements(): Map<string | number, HTMLElement>;
  getTimeSlotElements(): HTMLElement[];
}
```

**Controller Usage:**

```tsx
import { useRef, useEffect } from "react";
import { TimeLineChart, type TimeLineChartController } from "flex-charts";

function ControlledTimeline() {
  const chartRef = useRef<TimeLineChartController>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Subscribe to dimension changes
      const unsubscribe = chartRef.current.onDimensionChange((dimensions) => {
        console.log("Chart resized:", dimensions);
      });

      return unsubscribe; // Cleanup on unmount
    }
  }, []);

  const scrollToQuarter = () => {
    chartRef.current?.scrollTo(0.25); // Scroll to 25% position
  };

  return (
    <div>
      <button onClick={scrollToQuarter}>Scroll to 25%</button>
      <TimeLineChart
        ref={chartRef}
        startDate="2020"
        endDate="2025"
        interval="Y"
        bars={data}
      />
    </div>
  );
}
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
    "DD/MM/YY",
    // Add your custom patterns here
  ],
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

## Development Status

This library is currently in early development. Here's an overview of the current status:

| Feature           | Status                  |
| ----------------- | ----------------------- |
| Core architecture | 🚧 In Progress          |
| Time utilities    | ✅ Partially Complete   |
| Line charts       | 🚧 Basic Implementation |
| Bar charts        | 🚧 In Progress          |
| Timeline charts   | 🔄 Planned              |
| Theming           | 🚧 Basic Implementation |
| Documentation     | 📝 Draft                |
| Unit tests        | 🧪 In Progress          |

For a more detailed development roadmap, please refer to the [PLAN.md](./PLAN.md) file.

## Contributing

As this is a work in progress, contributions are welcome! Please check the [PLAN.md](./PLAN.md) file for planned features and current priorities.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🚀 Deployment

### GitHub Pages

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment process works as follows:

#### How it Works

1. **Trigger**: The deployment runs automatically on every push to the `main` branch
2. **Build Process**: GitHub Actions runs `npm run build:playground` to create the production build
3. **Output**: The build artifacts are generated in the `dist` directory
4. **Deployment**: The built files are automatically deployed to GitHub Pages

#### Configuration Files

- **GitHub Actions Workflow**: `.github/workflows/deploy.yml` handles the CI/CD pipeline
- **Vite Configuration**: `vite.config.ts` is configured with the correct base path (`/FlexCharts/`) for GitHub Pages
- **Build Script**: `package.json` includes a `build:playground` script that builds the demo app

#### Manual Deployment

You can also trigger a deployment manually:

1. Go to the repository's Actions tab on GitHub
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" and select the `main` branch

#### Local Testing

To test the production build locally before deployment:

```bash
# Build the playground
npm run build:playground

# Preview the production build (optional)
npm run preview
```

The demo will be available at: **[https://terotests.github.io/FlexCharts/](https://terotests.github.io/FlexCharts/)**
