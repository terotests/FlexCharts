# FlexCharts

> **⚠️ WORK IN PROGRESS**
>
> This library is currently under active development. The documentation below is a draft and describes planned functionality that may not be fully implemented yet. Features, APIs, and examples are subject to change.

A flexible chart library for React applications focused on time-based visualizations with advanced customization capabilities.

## Features

### Core Functionality

- 📐 **Flexible Layout System** - Adaptive wireframe structure with proper data positioning
- 🔄 **Smooth Scrolling** - Horizontal and vertical scrolling with touch support
- 📏 **Configurable Axes** - Customizable x and y axis with support for various data types
- 📊 **Timeline Charts** - Interactive timeline visualizations for project management and data analysis

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
import { TimeLineChart, type TimeLineChartController } from "@terotests/flex-charts";

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

## Component Props

### TimeLineChart Props

| Prop            | Type                                | Required | Description                                             |
| --------------- | ----------------------------------- | -------- | ------------------------------------------------------- |
| `startDate`     | `string`                            | Yes      | Start date of the timeline (e.g., "2020", "01/2020")    |
| `endDate`       | `string`                            | Yes      | End date of the timeline (e.g., "2025", "12/2025")      |
| `interval`      | `TTimeIntervalType`                 | Yes      | Time interval (`"Y"`, `"M"`, `"Q"`, `"W"`, `"D"`, etc.) |
| `bars`          | `TimeLineBarData[]`                 | No       | Array of bar data to display                            |
| `width`         | `string`                            | No       | Width of the component (default: "100%")                |
| `labelFontSize` | `string`                            | No       | Font size for time slot labels (default: "12px")        |
| `renderTitle`   | `(time: TTimeInterval) => string`   | No       | Custom function to render time slot labels              |
| `onBarClick`    | `(clickData: BarClickData) => void` | No       | Callback function called when a bar is clicked          |

### TimeLineBarData Interface

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

## Theming

Customize the appearance of your charts:

```tsx
import { useChartTheme } from "@terotests/flex-charts";

function App() {
  const { theme, toggleTheme, setThemeMode } = useChartTheme("light");

  return (
    <div style={{ backgroundColor: theme.colors.background }}>
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

## Time Utilities

Work with time intervals and calculations:

```tsx
import {
  calculateTimeSlot,
  parseTimeString,
  getTimeDifferenceInUnit,
} from "@terotests/flex-charts";

// Parse different time formats
const date1 = parseTimeString("2025-01-15");
const date2 = parseTimeString("15.01.2025"); // European format
const duration = parseTimeString("3 years");

// Calculate positions within time ranges
const position = calculateTimeSlot(
  { start: parseTimeString("2020"), end: parseTimeString("2025") },
  parseTimeString("2022-06")
); // Returns ~0.5 (middle of range)

// Get time differences
const monthsDiff = getTimeDifferenceInUnit(
  parseTimeString("2020"),
  parseTimeString("2024"),
  "M"
); // Returns 48 months
```

## Development Status

| Feature        | Status                  |
| -------------- | ----------------------- |
| TimeLineChart  | ✅ Complete             |
| Time utilities | ✅ Complete             |
| Theming        | 🚧 Basic Implementation |
| Documentation  | ✅ Complete             |
| Unit tests     | 🧪 In Progress          |

## Contributing

Contributions are welcome! Please check the technical documentation in the `flex-charts/` directory for development setup and implementation details.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
