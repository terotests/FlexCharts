# FlexCharts

> **⚠️ WORK IN PROGRESS**
>
> This library is currently under active development. The documentation below is a draft and describes planned functionality that may not be fully implemented yet. Features, APIs, and examples are subject to change.

A flexible chart library for React applications focused on time-based visualizations with advanced customization capabilities.

## Installation

```bash
npm install @terotests/flex-charts
# or
yarn add @terotests/flex-charts
# or
pnpm add @terotests/flex-charts
```

## 🌐 Live Demo

**[View the live demo on GitHub Pages →](https://terotests.github.io/FlexCharts/)**

The demo showcases the TimeLineChart component with interactive examples and code snippets. The demo is automatically deployed from the `main` branch using GitHub Actions whenever changes are pushed to the repository.

## Quick Start

### TimeLineChart

The TimeLineChart component provides a timeline visualization that can display bars representing time periods with custom colors and labels.

```tsx
import { TimeLineChart, type TimeLineBarData } from "@terotests/flex-charts";

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

## Usage Examples

### Basic Timeline (Time Slots Only)

Display a simple timeline with time markers but no data bars:

```tsx
<TimeLineChart startDate="2020" endDate="2025" interval="Y" />
```

### Project Timeline with Interactive Bars

Create an interactive project timeline with clickable bars:

```tsx
import {
  TimeLineChart,
  type BarClickData,
  type TimeLineBarData,
} from "@terotests/flex-charts";

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
  const { bar, relativePosition, controller } = clickData;

  console.log(`Clicked: ${bar.label} (${bar.start} - ${bar.end})`);

  // Center the clicked bar
  controller.scrollTo(relativePosition.center);
};

function ProjectTimeline() {
  return (
    <TimeLineChart
      startDate="01/2024"
      endDate="12/2024"
      interval="M"
      bars={projectData}
      onBarClick={handleBarClick}
      width="1000px"
      renderTitle={(time) => time.value.toString().slice(0, 3)}
    />
  );
}
```

### Programmatic Control

Use refs to control the timeline programmatically:

```tsx
import { useRef } from "react";
import {
  TimeLineChart,
  type TimeLineChartController,
} from "@terotests/flex-charts";

function ControlledTimeline() {
  const chartRef = useRef<TimeLineChartController>(null);

  const scrollToQuarter = () => {
    chartRef.current?.scrollTo(0.25); // Scroll to 25% position
  };

  const centerChart = () => {
    chartRef.current?.scrollToCenter();
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={scrollToQuarter}>Go to 25%</button>
        <button onClick={centerChart}>Center Chart</button>
      </div>
      <TimeLineChart
        ref={chartRef}
        startDate="2020"
        endDate="2025"
        interval="Y"
        bars={projectData}
      />
    </div>
  );
}
```

### Event Handling

FlexCharts provides comprehensive event handling for user interactions:

```tsx
import {
  TimeLineChart,
  type BarClickData,
  type RowClickData,
  type ChartHoverData,
} from "@terotests/flex-charts";

function InteractiveTimeline() {
  const handleBarClick = (clickData: BarClickData) => {
    console.log("Bar clicked:", clickData.bar.label);
    console.log("Position:", clickData.relativePosition);
    console.log("Dimensions:", clickData.dimensions);
    // Access chart controller for programmatic control
    clickData.controller.scrollToCenter();
  };

  const handleRowClick = (clickData: RowClickData) => {
    console.log("Row clicked:", clickData.bar.label);
    console.log("Row container dimensions:", clickData.dimensions);
    // Same data structure as BarClickData for consistency
  };

  const handleChartHover = (hoverData: ChartHoverData) => {
    console.log("Mouse position:", hoverData.relativePosition);
    if (hoverData.activeTimeSlot) {
      console.log("Time slot:", hoverData.activeTimeSlot.value);
    }
  };

  return (
    <TimeLineChart
      startDate="2020"
      endDate="2025"
      interval="Y"
      bars={projectData}
      onBarClick={handleBarClick}
      onRowClick={handleRowClick}
      onChartHover={handleChartHover}
    />
  );
}
```

#### Event Data Interfaces

**BarClickData / RowClickData:**

- `bar: TimeLineBarData` - The clicked bar's data
- `relativePosition: { start, end, center }` - Position within chart (0-1)
- `dimensions: { width, height, left, top, chartWidth, chartHeight }` - Element dimensions
- `controller: TimeLineChartController` - Chart controller reference
- `event: React.MouseEvent` - Original mouse event

**ChartHoverData:**

- `relativePosition: number` - Mouse position within chart (0-1)
- `pixelPosition: { x, y }` - Pixel coordinates within chart
- `activeTimeSlot: { index, value, start, end } | null` - Active time slot info
- `controller: TimeLineChartController` - Chart controller reference
- `event: React.MouseEvent` - Original mouse event

### Multi-Slot Timeline Rendering

FlexCharts automatically handles complex timeline data with overlapping periods by grouping bars with the same ID into multi-slot rows:

```tsx
import { TimeLineChart, type TimeLineBarData } from "@terotests/flex-charts";

// Timeline data with overlapping periods (same ID)
const complexTimeline: TimeLineBarData[] = [
  {
    id: "project1", // Same ID groups items together
    start: "01/2024",
    end: "06/2024",
    label: "Phase 1",
    backgroundColor: "#3b82f6",
  },
  {
    id: "project1", // Same ID as above
    start: "05/2024",
    end: "10/2024",
    label: "Phase 2",
    backgroundColor: "#ef4444",
  },
  {
    id: "project2", // Different ID creates separate row
    start: "03/2024",
    end: "08/2024",
    label: "Project B",
    backgroundColor: "#22c55e",
  },
];

function MultiSlotTimeline() {
  return (
    <TimeLineChart
      startDate="01/2024"
      endDate="12/2024"
      interval="M"
      bars={complexTimeline}
      // FlexCharts automatically detects overlapping periods
      // and renders them as separate slots within the same row
    />
  );
}
```

**What happens automatically:**

- Bars with the same `id` are grouped into a single row
- Overlapping time periods become separate slots within that row
- Each slot is positioned relative to the row's full time range
- Non-overlapping bars with different IDs get their own rows
- The chart intelligently switches between single-bar and multi-slot rendering modes

### Custom Rendering

FlexCharts provides flexible custom rendering options for each timeline row:

```tsx
import { TimeLineChart, type BarRenderContext } from "@terotests/flex-charts";

function CustomTimeline() {
  // Custom prefix component (rendered at the start of each row)
  const renderRowPrefix = (context: BarRenderContext) => (
    <div
      style={{
        padding: "4px 8px",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      ID: {context.bar.id}
    </div>
  );
  // Custom suffix component (rendered after the bar)
  const renderRowSuffix = (context: BarRenderContext) => (
    <div
      style={{
        fontSize: "12px",
        color: "#666",
        marginLeft: "8px",
      }}
    >
      Duration: {context.bar.end} - {context.bar.start}
    </div>
  );

  // Custom bar content (replaces default label)
  const renderBarContent = (context: BarRenderContext) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span>🎯</span>
      <span>{context.bar.label}</span>
      <span style={{ fontSize: "10px", opacity: 0.8 }}>
        ({Math.round(context.relativePosition.center * 100)}%)
      </span>
    </div>
  );

  return (
    <TimeLineChart
      startDate="2020"
      endDate="2025"
      interval="Y"
      bars={projectData}
      renderRowPrefix={renderRowPrefix}
      renderRowSuffix={renderRowSuffix}
      renderBarContent={renderBarContent}
    />
  );
}
```

#### BarRenderContext Interface

The render functions receive a `BarRenderContext` object with:

- `bar: TimeLineBarData` - The bar's data
- `controller: TimeLineChartController` - Chart controller for programmatic control
- `relativePosition: { start, end, center }` - Bar position within chart (0-1)
- `dimensions: { width, height }` - Bar's pixel dimensions
- `slots?: TimeSlot[]` - Optional slots array for multi-slot rendering contexts

#### Rendering Options

1. **Row Prefix (`renderRowPrefix`)**: Rendered at the start of each row, useful for labels, IDs, or status indicators
2. **Bar Suffix (`renderRowSuffix`)**: Rendered after the bar on the same row, perfect for additional metadata or duration information
3. **Bar Content (`renderBarContent`)**: Replaces the default bar label, allowing complete customization of bar content

All render functions have access to the chart controller, enabling interactive custom components that can programmatically control the timeline.

### Timeline Data Processing

FlexCharts includes powerful utilities for processing and validating timeline data:

```tsx
import {
  processTimelineData,
  validateTimeSlots,
  flattenTimelineRows,
  type TimelineRow,
  type TimeSlot,
} from "@terotests/flex-charts";

// Process raw timeline data into grouped rows
const timelineData: TimeLineBarData[] = [
  { id: "project1", start: "01/2024", end: "06/2024", label: "Phase 1" },
  { id: "project1", start: "05/2024", end: "10/2024", label: "Phase 2" },
  { id: "project2", start: "03/2024", end: "08/2024", label: "Project B" },
];

const processedRows = processTimelineData(timelineData, {
  start: "01/2024",
  end: "12/2024",
});

// Validate timeline slots for overlaps
const validationErrors = validateTimeSlots(processedRows[0].slots);
if (validationErrors.length > 0) {
  console.warn("Timeline validation errors:", validationErrors);
}

// Convert back to flat data if needed
const flatData = flattenTimelineRows(processedRows);
```

#### Timeline Data Processor Features

- **Automatic Grouping**: Groups bars by ID into timeline rows
- **Overlap Detection**: Identifies and handles overlapping time periods
- **Relative Positioning**: Calculates relative positions within each row
- **Validation**: Checks for data integrity and overlap issues
- **Bidirectional Conversion**: Convert between flat and grouped data structures

## Component Props

### TimeLineChart Props

| Prop               | Type                                             | Required | Description                                                                                                |
| ------------------ | ------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `startDate`        | `string`                                         | Yes      | Start date of the timeline (e.g., "2020", "01/2020")                                                       |
| `endDate`          | `string`                                         | Yes      | End date of the timeline (e.g., "2025", "12/2025")                                                         |
| `interval`         | `TTimeIntervalType`                              | Yes      | Time interval (`"Y"`, `"M"`, `"Q"`, `"W"`, `"D"`, `"H"`, `"m"`, `"s"`, `"5Y"`, `"10Y"`, `"50Y"`, `"100Y"`) |
| `bars`             | `TimeLineBarData[]`                              | No       | Array of bar data to display                                                                               |
| `width`            | `string`                                         | No       | Width of the component (default: "100%")                                                                   |
| `labelFontSize`    | `string`                                         | No       | Font size for time slot labels (default: "12px")                                                           |
| `renderTitle`      | `(time: TTimeInterval) => string`                | No       | Custom function to render time slot labels                                                                 |
| `onBarClick`       | `(clickData: BarClickData) => void`              | No       | Callback function called when a bar is clicked                                                             |
| `onRowClick`       | `(clickData: RowClickData) => void`              | No       | Callback function called when a row container is clicked                                                   |
| `onChartHover`     | `(hoverData: ChartHoverData) => void`            | No       | Callback function called when mouse hovers over the chart                                                  |
| `renderRowPrefix`  | `(context: BarRenderContext) => React.ReactNode` | No       | Custom component rendered at the start of each row                                                         |
| `renderRowSuffix`  | `(context: BarRenderContext) => React.ReactNode` | No       | Custom component rendered after each bar on the same row                                                   |
| `renderBarContent` | `(context: BarRenderContext) => React.ReactNode` | No       | Custom component rendered inside the bar (replaces default label)                                          |
| `leftMargin`       | `string \| number`                               | No       | Margin for prefix elements that overflow to the left (default: 0)                                          |

### TimeLineBarData Interface

```tsx
interface TimeLineBarData {
  id?: string | number; // Optional unique identifier for grouping
  start: string; // Start date/time string
  end: string; // End date/time string
  label: string; // Text to display on the bar
  color?: string; // Border color (defaults to backgroundColor)
  backgroundColor?: string; // Background color (default: "#3b82f6")
  textColor?: string; // Text color (default: "white")
}
```

**Note**: When multiple bars share the same `id`, they are automatically grouped into a single row with multiple slots, enabling complex timeline visualizations with overlapping periods.

## API Reference

### Core Components

#### TimeLineChart

The main timeline visualization component with full customization support.

#### TimeLineChartController

Programmatic controller for timeline navigation and interaction:

```tsx
import { useRef } from "react";
import { TimeLineChartController } from "@terotests/flex-charts";

const chartRef = useRef<TimeLineChartController>(null);

// Navigation methods
chartRef.current?.scrollTo(0.5); // Scroll to 50% position
chartRef.current?.scrollToCenter(); // Center the timeline
chartRef.current?.getDimensions(); // Get chart dimensions

// Element access
chartRef.current?.getBarElement("bar-id"); // Get bar DOM element
chartRef.current?.updateTimeSlotElements(elements); // Update time slots
```

### Utility Classes

#### TimeInterval

Chainable utility class for time operations:

```tsx
import { Time, TimeInterval } from "@terotests/flex-charts";

// Creation methods
const time = Time.parse("2024-01-15");
const time2 = TimeInterval.fromDate(new Date(), "D");
const time3 = Time.now("Y");

// Operations
const diff = time.diffInUnit(time2, "M");
const position = time.positionInSpan(span);
const comparison = time.compare(time2); // -1, 0, or 1
```

#### TimeSpan

Utility class for working with time ranges:

```tsx
import { TimeSpan, Time } from "@terotests/flex-charts";

const span = Time.span("2024-01-01", "2024-12-31");
const duration = span.durationInUnit("M"); // 12 months
const intervals = span.splitInto("Q"); // 4 quarters
```

### Data Processing

#### Timeline Data Processor

```tsx
import { processTimelineData, validateTimeSlots } from "@terotests/flex-charts";

// Process and group timeline data
const rows = processTimelineData(barData, { start: "2024", end: "2025" });

// Validate for overlaps
const errors = validateTimeSlots(rows[0].slots);
```

## Example Data Sets

FlexCharts includes several example datasets to help you get started and demonstrate different use cases:

### British Monarchs (Historical Timeline)

A comprehensive dataset of British monarchs from 1558 to present day, organized by royal houses:

```tsx
import { britishMonarchs } from "@terotests/flex-charts";

<TimeLineChart
  startDate="1600"
  endDate="2024"
  interval="10Y"
  bars={britishMonarchs}
  renderTitle={(time) => `${time.value}s`}
/>;
```

**Features:**

- Covers major royal houses (Tudor, Stuart, Hanover, Windsor)
- Color-coded by dynasty
- Historical accuracy with precise reign dates
- Demonstrates long-term historical visualization

### Finnish Presidents (Political Timeline)

Dataset of Finnish presidents from 1919 to present day:

```tsx
import { finnishPresidents } from "@terotests/flex-charts";

<TimeLineChart
  startDate="1919"
  endDate="2024"
  interval="5Y"
  bars={finnishPresidents}
  renderTitle={(time) => `${time.value}`}
/>;
```

**Features:**

- Complete presidential terms with exact dates
- Color-coded by political affiliation
- Demonstrates modern political timeline visualization
- Precise date formatting for recent history

### SM-Liiga Champions (Sports Timeline)

Finnish ice hockey league championship timeline:

```tsx
import { smLiigaChampions } from "@terotests/flex-charts";

<TimeLineChart
  startDate="1976"
  endDate="2024"
  interval="Y"
  bars={smLiigaChampions}
  renderTitle={(time) => `${time.value}-${time.value + 1}`}
/>;
```

**Features:**

- Season-based timeline (1976-77, 1977-78, etc.)
- Team-specific color coding
- Demonstrates sports data visualization
- Annual intervals with custom title rendering

### Custom Programming Languages (Development Timeline)

Simple example dataset for software development timelines:

```tsx
import { customBars } from "@terotests/flex-charts";

<TimeLineChart
  startDate="1990"
  endDate="2010"
  interval="Y"
  bars={customBars}
/>;
```

**Features:**

- Programming language usage periods
- Overlapping timelines demonstrating multi-slot rendering
- Simple date format examples
- Technology adoption visualization

### Using Example Data

All example datasets are exported from the main package:

```tsx
import {
  britishMonarchs,
  finnishPresidents,
  smLiigaChampions,
  customBars,
  TimeLineChart,
} from "@terotests/flex-charts";

// Combine datasets for comparison
const combinedData = [
  ...britishMonarchs.map((item) => ({ ...item, category: "Monarchs" })),
  ...finnishPresidents.map((item) => ({ ...item, category: "Presidents" })),
];

<TimeLineChart
  startDate="1900"
  endDate="2024"
  interval="10Y"
  bars={combinedData}
  renderRowPrefix={(row) => <span>{row.category}</span>}
/>;
```

### Creating Custom Datasets

Use the example datasets as templates for your own data:

```tsx
import type { TimeLineBarData } from "@terotests/flex-charts";

const myCustomData: TimeLineBarData[] = [
  {
    id: "project-1",
    start: "2020-01-01",
    end: "2022-06-30",
    label: "Project Alpha",
    backgroundColor: "#3498db",
    textColor: "white",
  },
  {
    id: "project-2",
    start: "2021-03-15",
    end: "2023-12-31",
    label: "Project Beta",
    backgroundColor: "#e74c3c",
    textColor: "white",
  },
];
```

## Theming

FlexCharts uses CSS custom properties (variables) for theming. You can customize the appearance by overriding these CSS variables:

```css
:root {
  /* Bar styling */
  --bar-bg: #f4f6fa;
  --bar-border: #b0b8c9;
  --bar-shadow: 0 2px 8px 0 rgba(40, 60, 90, 0.08);
  --bar-text: #25324d;
  --bar-hover-bg: #e3e8f0;
  --bar-hover-border: #4e79a7;
  --bar-hover-shadow: 0 4px 16px 0 rgba(40, 60, 90, 0.13);

  /* Time slot styling */
  --slot-bg: #e3e8f0;
  --slot-text: #4e79a7;
  --slot-border: #b0b8c9;

  /* Grid lines */
  --grid-line-color: rgba(176, 184, 201, 0.3);
  --grid-line-width: 1px;
  --grid-line-style: solid;
  --grid-background: transparent;
  --grid-hover-color: rgba(78, 121, 167, 0.2);

  /* Scrollbar styling */
  --scrollbar-track-color: rgba(228, 230, 235, 0.3);
  --scrollbar-thumb-color: rgba(78, 121, 167, 0.4);
  --scrollbar-thumb-hover-color: rgba(78, 121, 167, 0.6);
  --scrollbar-thumb-active-color: rgba(78, 121, 167, 0.8);
  --scrollbar-size: 8px;
  --scrollbar-border-radius: 4px;

  /* Time slots transparency when transformed */
  --timeslots-transformed-opacity: 0.9;
}
```

### Using the Theme Hook

```tsx
import { useChartTheme } from "@terotests/flex-charts";

function App() {
  const { theme, toggleTheme, setThemeMode } = useChartTheme("light");

  return (
    <div>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <TimeLineChart
        startDate="2020"
        endDate="2025"
        interval="Y"
        bars={timelineBars}
      />
    </div>
  );
}
```

### CSS Classes Reference

FlexCharts components use specific CSS classes that you can target for custom styling:

| CSS Class                          | Component     | Description                                                |
| ---------------------------------- | ------------- | ---------------------------------------------------------- |
| `.bar`                             | TimeLineChart | Individual timeline bars representing data periods         |
| `.time-slots`                      | TimeLineChart | Container for time slot markers                            |
| `.time-slot`                       | TimeLineChart | Individual time slot markers (circular indicators)         |
| `.time-slots-transformed`          | TimeLineChart | Time slots container when transformed/moved for visibility |
| `.time-grid`                       | TimeLineChart | Grid lines container overlaying the timeline               |
| `.time-grid-line`                  | TimeLineChart | Individual vertical grid lines                             |
| `.timeline-chart-scroll-container` | TimeLineChart | Main scrollable container for the timeline                 |

**Example of custom styling:**

```css
/* Custom bar styling */
.bar {
  --bar-bg: #your-custom-color;
  --bar-border: #your-border-color;
  border-radius: 8px; /* Override default rounded style */
}

/* Custom time slot styling */
.time-slot {
  --slot-bg: #your-slot-color;
  width: 32px; /* Make slots larger */
  height: 32px;
}

/* Custom grid styling */
.time-grid-line {
  --grid-line-color: rgba(255, 0, 0, 0.2); /* Red grid lines */
  --grid-line-width: 2px; /* Thicker lines */
}
```

## Time Utilities

FlexCharts provides powerful time handling utilities for working with time intervals and calculations:

```tsx
import {
  TimeInterval,
  TimeSpan,
  Time,
  calculateTimeSlot,
  parseTimeString,
  getTimeDifferenceInUnit,
} from "@terotests/flex-charts";

// Fluent API with TimeInterval class
const start = Time.parse("2024-01-01");
const end = Time.parse("2024-12-31");
const span = Time.span("2024-01-01", "2024-12-31");

// Chain operations fluently
const currentYear = Time.now("Y")
  .withValue(2024)
  .withIncrement(Time.parse("03", "MM")); // 2024-03

// Calculate differences
const diffInMonths = start.diffInUnit(end, "M"); // 12 months
const position = start.positionInSpan(span); // 0 (start of span)

// Parse different time formats
const date1 = parseTimeString("2025-01-15");
const date2 = parseTimeString("15.01.2025"); // European format
const duration = parseTimeString("3 years");

// Calculate positions within time ranges
const position = calculateTimeSlot(
  { start: parseTimeString("2020"), end: parseTimeString("2025") },
  parseTimeString("2022-06")
); // Returns ~0.5 (middle of range)

// Convert to different formats
const dateObj = start.toDate("D");
const seconds = start.toSeconds();
const jsonData = start.toJSON(); // Export as TTimeInterval
```

### TimeInterval Class Features

The `TimeInterval` class provides a chainable fluent API for time operations:

```tsx
// Create TimeInterval instances
const time1 = Time.parse("2024-01-15");
const time2 = Time.fromDate(new Date(), "D");
const time3 = Time.now("Y");

// Chain operations
const modifiedTime = time1
  .withValue(2025)
  .withType("M")
  .withIncrement(Time.parse("03"));

// Comparisons
const isAfter = time1.isAfter(time2);
const isBefore = time1.isBefore(time2);
const isEqual = time1.equals(time2);

// Range checking
const isInRange = time1.isInRange({ start: time2, end: time3 });

// String conversion with automatic formatting
const timeString = time1.toString(); // "2024-01-15"
```

### TimeSpan Utilities

Work with time spans and ranges:

```tsx
// Create spans
const span = Time.span("2024-01-01", "2024-12-31");
const span2 = TimeSpan.from("2020", "2025");

// Span operations
const duration = span.durationInUnit("M"); // 12 months
const position = span.positionOf(Time.parse("2024-06-15")); // ~0.5
const contains = span.contains(Time.parse("2024-03-01")); // true

// Split spans into intervals
const quarters = span.splitInto("Q"); // Array of 4 quarters
const months = span.splitInto("M"); // Array of 12 months
```

### Supported Time Intervals

FlexCharts supports various time interval types for timeline visualization:

#### Standard Intervals

- `"Y"` - Years
- `"M"` - Months
- `"Q"` - Quarters
- `"W"` - Weeks
- `"D"` - Days
- `"H"` - Hours
- `"m"` - Minutes
- `"s"` - Seconds

#### Decade Intervals

For long-term timeline visualization, FlexCharts supports decade notation:

- `"5Y"` - 5-year intervals
- `"10Y"` - 10-year intervals (decades)
- `"50Y"` - 50-year intervals (half-centuries)
- `"100Y"` - 100-year intervals (centuries)

```tsx
// Example: Display centuries for historical data
<TimeLineChart
  startDate="1500"
  endDate="2000"
  interval="100Y"
  renderTitle={(time) => `${time.value}s`}
/>

// Example: Display decades for recent history
<TimeLineChart
  startDate="1950"
  endDate="2030"
  interval="10Y"
  renderTitle={(time) => `${time.value}s`}
/>
```

## Development Status

| Feature                 | Status      | Description                                          |
| ----------------------- | ----------- | ---------------------------------------------------- |
| TimeLineChart           | ✅ Complete | Full timeline visualization with all features        |
| Multi-slot Rendering    | ✅ Complete | Automatic grouping and overlap handling              |
| TimeInterval Class      | ✅ Complete | Chainable fluent API for time operations             |
| Time Utilities          | ✅ Complete | Comprehensive time parsing and calculation functions |
| Timeline Data Processor | ✅ Complete | Data grouping, validation, and processing utilities  |
| Chart Controller        | ✅ Complete | Programmatic chart control and navigation            |
| Custom Rendering        | ✅ Complete | Flexible row prefix, suffix, and content rendering   |
| Event Handling          | ✅ Complete | Bar clicks, row clicks, and hover events             |
| Theming System          | ✅ Complete | CSS custom properties for complete visual control    |
| TypeScript Support      | ✅ Complete | Full type definitions and IntelliSense support       |
| Documentation           | ✅ Complete | Comprehensive README and code examples               |
| Unit Tests              | ✅ Complete | Extensive test coverage for all utilities            |
| E2E Tests               | ✅ Complete | Playwright tests for timeline chart functionality    |

## Contributing

Contributions are welcome! Please check the technical documentation in the `flex-charts/` directory for development setup and implementation details.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
